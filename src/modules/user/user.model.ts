import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";

const authProviderSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["google", "credentials"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    picture: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    isDeleted: {
      type: String,
      required: false,
      default: "false",
    },
    isActive: {
      type: String,
      required: false,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    role: {
      type: String,
      required: false,
      enum: Object.values(Role),
      default: Role.USER,
    },
    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const User = model<IUser>("User", userSchema);
