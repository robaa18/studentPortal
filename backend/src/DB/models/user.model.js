import mongoose from "mongoose";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    lastName: {
      type: String,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    studentID: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    academicLevel: {
      type: String,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    major: {
      type: String,
      default: "Computer Science",
    },

    dateOfBirth: {
      type: Date,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    phoneNumber: {
      type: String,
    },

    gpa: {
      type: Number,
      default: 0.0,
    },

    creditsEarned: {
      type: Number,
      default: 0,
    },

    creditsTotal: {
      type: Number,
      default: 120,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "probation"],
      default: "active",
    },

    userName: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: Number,
      default: RoleEnum.STUDENT,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "User",
  }
);

userSchema.virtual("studentId").get(function () {
  return this.studentID;
});

userSchema.virtual("roleName").get(function () {
  return this.role === RoleEnum.ADMIN ? "admin" : "student";
});

userSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
