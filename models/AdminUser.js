import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      default: "Admin",
    },
    role: {
      type: String,
      enum: ["super_admin", "admin", "editor"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: Date,
    permissions: {
      manageProducts: { type: Boolean, default: true },
      manageBlogs: { type: Boolean, default: true },
      manageHeroSlides: { type: Boolean, default: true },
      manageAdmins: { type: Boolean, default: false },
      viewAnalytics: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Hash password before saving
AdminUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error("Password hashing failed: " + error.message);
  }
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Method to check if account is locked
AdminUserSchema.methods.isLocked = function () {
  return this.lockedUntil && this.lockedUntil > new Date();
};

// Method to increment login attempts
AdminUserSchema.methods.incrementLoginAttempts = async function () {
  // Reset attempts if lock has expired
  if (this.lockedUntil && this.lockedUntil < new Date()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockedUntil: 1 },
    });
  }

  // Increment attempts
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 15 minutes
  const maxAttempts = 5;
  const lockTime = 15 * 60 * 1000; // 15 minutes

  if (this.loginAttempts + 1 >= maxAttempts) {
    updates.$set = { lockedUntil: new Date(Date.now() + lockTime) };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
AdminUserSchema.methods.resetLoginAttempts = async function () {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockedUntil: 1 },
  });
};

export default mongoose.models.AdminUser ||
  mongoose.model("AdminUser", AdminUserSchema);
