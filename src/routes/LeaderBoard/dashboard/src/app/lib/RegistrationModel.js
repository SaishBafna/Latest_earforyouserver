
import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema(
  { 
    avatar: {
      type: {
        url: {
          type: String,
          default: "https://cdn-icons-png.flaticon.com/512/660/660611.png", // Default avatar URL
        },
        localPath: String,
        _id: false
      },
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim:true,
    },
    companyAddress: {
      type: String,
      required: false,
    },
    serviceType: {
      type: String,
      enum: ["Driver", "Mechanic", "Tower","Agent","Company"], 
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Compound index for login 
userSchema.index({ email: 1, phone: 1 });

// Compound index 
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Hash the password 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Check if the password is already hashed (i.e., if it starts with $2b$ for bcrypt)
  if (!this.password.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
