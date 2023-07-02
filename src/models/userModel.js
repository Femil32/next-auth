import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide your name"],
    min: [2, "Too short, min is 2 characters"],
    max: [32, "Too long, max is 32 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    unique: [true, "Email already exists"],
    min: [4, "Too short, min is 4 characters"],
    max: [32, "Too long, max is 32 characters"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "is invalid"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    min: [6, "Too short, min is 6 characters"],
    max: [32, "Too long, max is 32 characters"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
