import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let serviceAccount;

try {
  const raw = process.env.serviceAccount || process.env.serviceAccount1;

  if (!raw) {
    throw new Error("Firebase service account env not found");
  }

  serviceAccount = JSON.parse(raw);

  // 🔴 FIX newline issue
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
} catch (error) {
  console.error("❌ Firebase service account parse error:", error);
  process.exit(1);
}

// 🔴 VERY IMPORTANT: initialize only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, // 🔥 REQUIRED
  });

  console.log("✅ Firebase Admin Initialized");
}

export default admin;
