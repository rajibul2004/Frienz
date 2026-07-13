import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: function () {
            return this.type === 'text';
        },
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
        index: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text',
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null,
    },
    reactions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        emoji: {
            type: String,
            required: true,
        },
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    isPinned: {
        type: Boolean,
        default: false,
        index: true,
    },
    pinnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    pinnedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

messageSchema.pre('validate', function () {
    if (this.from && this.to) {
        this.conversationId =
            this.from.toString() < this.to.toString()
                ? `${this.from}_${this.to}`
                : `${this.to}_${this.from}`;
    }
});

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;