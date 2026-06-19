import mongoose from "mongoose";
import dotenv from "dotenv";
import AdminUser from "../models/AdminUser.js";

dotenv.config({ path: ".env.local" });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not set in .env.local");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const email =
    process.env.ADMIN_DEFAULT_EMAIL ||
    (process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(",")[0]) ||
    "admin@smartome.local";

  const newPassword = process.env.ADMIN_DEFAULT_PASSWORD || process.env.ADMIN_PASSWORD || "SmartAdmin123!@#";

  let admin = await AdminUser.findOne({ email });
  if (!admin) {
    console.log(`Admin not found for ${email} — creating new admin user.`);
    admin = new AdminUser({
      email,
      password: newPassword,
      fullName: process.env.ADMIN_DEFAULT_FULLNAME || "Admin",
      role: "super_admin",
      isActive: true,
    });
    await admin.save();
    console.log("Created admin:", email);
  } else {
    console.log("Found admin:", email, "— updating password (will be hashed on save)");
    admin.password = newPassword;
    await admin.save();
    console.log("Password updated for:", email);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
