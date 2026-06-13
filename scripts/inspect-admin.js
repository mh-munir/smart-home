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

  const admins = await AdminUser.find({}).lean();
  if (!admins || admins.length === 0) {
    console.log("No admin users found in the database.");
  } else {
    console.log(`Found ${admins.length} admin user(s):`);
    admins.forEach((a) => {
      console.log({
        email: a.email,
        isActive: a.isActive,
        createdAt: a.createdAt,
        // show truncated hash to avoid leaking the full hash
        passwordHashPreview:
          typeof a.password === "string"
            ? `${a.password.slice(0, 10)}...${a.password.slice(-10)}`
            : null,
      });
    });
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
