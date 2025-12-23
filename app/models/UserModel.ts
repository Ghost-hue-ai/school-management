import mongoose, { Schema, Document, Model } from "mongoose";

interface UserDocument extends Document {
  email: string;
  password: string;
  username: string;
  isVerified: boolean;
  hasJoinedSchool: boolean;
  school: Schema.Types.ObjectId;
}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    hasJoinedSchool: { type: Boolean, default: false },
    school: { type: Schema.Types.ObjectId, ref: "School", required: false },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User",userSchema);
export default UserModel;