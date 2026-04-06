import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetOtp: {
      type: String,
      default: '',
    },
    resetOtpExpAt: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: ""
    },
    profilePic: {
      type: String,
      default: ""
    },
    nativeLang: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    isBoarded: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
    }],
}, { timestamps: true });

const UserModel =mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;