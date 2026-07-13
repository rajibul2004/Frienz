import UserModel from "../models/userModel.js";
import ConnectionModel from "../models/connectionModel.js";

const getRecommendedUsers = async (req, res) => {
    try {
        const currentUser = req.user ;
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const recommendedUsers = await UserModel.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: { $nin: currentUser.friends || [] } },
                { isBoarded: true }
            ]
        })
            .select('name profilePic nativeLang location bio') // Only needed fields
            .limit(20);
        return res.status(200).json({
            success: true,
            recommendedUsers,
            count: recommendedUsers.length
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getFriends = async (req, res) => {
    try {
        const currentUserId = req.userId || req.body.userId;
        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const currentUser = await UserModel.findById(currentUserId)
            .select("friends")
            .populate({
                path: "friends",
                select: "name profilePic nativeLang location",
                options: { limit: 50 }
            });
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            friends: currentUser.friends || [],
            count: currentUser.friends?.length || 0
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const sendFriendRequest = async (req, res) => {
    try {
        const currentUser = req.user;
        if(!currentUser) {
            return res.status(404).json({
                success: false, 
                message: "User not found"
            });
        }   
       
        const { id: recipientId } = req.params;
        if (!recipientId) {
            return res.status(400).json({
                success: false,
                message: "Recipient ID is required"
            });
        }

        if (currentUser._id.toString() === recipientId) {
            return res.status(400).json({
                success: false,
                message: "You can't send friend request to yourself"
            });
        }

        const recipient = await UserModel.exists({ _id: recipientId });
        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });
        }

        if (currentUser?.friends?.some(f => f.toString() === recipientId)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends with this user"
            });
        }

        const existingRequest = await ConnectionModel.findOne({
            $or: [
                { sender: currentUser._id, recipient: recipientId },
                { sender: recipientId, recipient: currentUser._id }
            ]
        });

        if (existingRequest) {
            const message = existingRequest.status === 'pending'
                ? "A friend request already exists"
                : "You have a previous interaction with this user";

            return res.status(400).json({
                success: false,
                message,
                status: existingRequest.status
            });
        }

        const friendRequest = await ConnectionModel.create({
            sender: currentUser._id,
            recipient: recipientId,
            status: 'pending'
        });

        return res.status(201).json({
            success: true,
            message: "Friend request sent successfully",
            request: {
                id: friendRequest._id,
                status: friendRequest.status,
                createdAt: friendRequest.createdAt
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "User not Found"
            });
        }

        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: "Request ID is required"
            });
        }
        const friendRequest = await ConnectionModel.findById(requestId);

        if (!friendRequest) {
            return res.status(400).json({
                success: false,
                message: "Friend request not found"
            });
        }
        if (friendRequest.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `This request has already been ${friendRequest.status}`
            });
        }

        if (friendRequest.recipient.toString() !== currentUser._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this request"
            });
        }

        await Promise.all([
            UserModel.findByIdAndUpdate(
                friendRequest.sender,
                { $addToSet: { friends: friendRequest.recipient } }
            ),
            UserModel.findByIdAndUpdate(
                friendRequest.recipient,
                { $addToSet: { friends: friendRequest.sender } }
            )
        ]);
        friendRequest.status = "accepted";
        await friendRequest.save();

        return res.status(200).json({
            success: true,
            message: "Friend request accepted successfully",
            friendship: {
                user1: friendRequest.sender,
                user2: friendRequest.recipient
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getFriendRequest = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.userId;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const [incomingRequests, acceptedRequests] = await Promise.all([
            ConnectionModel.find({
                recipient: currentUserId,
                status: "pending"
            })
                .populate("sender", "name profilePic nativeLang location bio")
                .sort({ createdAt: -1 })
                .limit(50),

            ConnectionModel.find({
                sender: currentUserId,
                status: "accepted"
            })
                .populate("recipient", "name profilePic nativeLang location bio")
                .sort({ createdAt: -1 })
                .limit(50)
        ]);

        return res.status(200).json({
            success: true,
            data: {
                incoming: {
                    requests: incomingRequests,
                    count: incomingRequests.length
                },
                accepted: {
                    requests: acceptedRequests,
                    count: acceptedRequests.length
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getOutGoingReq = async (req, res) => {
    try {
        const currentUserId = req.user?.id || req.userId;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const outgoingRequests = await ConnectionModel.find({
            sender: currentUserId,
            status: "pending"
        })
            .populate("recipient", "name profilePic nativeLang location bio")
            .sort({ createdAt: -1 })
            .limit(50)
        return res.status(200).json({
            success: true,
            data: {
                requests: outgoingRequests,
                count: outgoingRequests.length
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const removeFriend=async(req,res)=>{
    try{
        const currentUserId = req.userId || req.body.userId;

        const { id: friendId } = req.params;
        if (!currentUserId) {
            return res.status(401).json({
                success: false, 
                message: "User not authenticated"
            });
        }
        if (!friendId) {
            return res.status(400).json({
                success: false,
                message: "Friend ID is required"
            });
        }
            await Promise.all([ 
                UserModel.findByIdAndUpdate(
                    currentUserId,
                    { $pull: { friends: friendId } }
                ),
                UserModel.findByIdAndUpdate(
                    friendId,
                    { $pull: { friends: currentUserId } }
                )
            ]); 
            await ConnectionModel.findOneAndDelete({
                $or: [
                    { sender: currentUserId, recipient: friendId },
                    { sender: friendId, recipient: currentUserId }
                ]
            });
        return res.status(200).json({
            success: true,
            message: "Friend removed successfully"
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


export {
    getRecommendedUsers,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutGoingReq,
    removeFriend,
};