import { validateChatPayment } from "../path/to/controller.js";
import { ChatUserPremium } from "../../../models/Subscriptionchat/ChatUserPremium.js";
import ChatPremium from "../../../models/Subscriptionchat/ChatPremium.js";
import { Coupon, CouponUsage } from "../../../models/CouponSystem/couponModel.js";
import User from "../../../models/Users.js";
import axios from "axios";
import admin from "../../../config/firebaseConfig.js";
import sha256 from "sha256";

jest.mock("axios");
jest.mock("sha256");
jest.mock("../../../models/Subscriptionchat/ChatUserPremium.js", () => ({
  ChatUserPremium: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));
jest.mock("../../../models/Subscriptionchat/ChatPremium.js", () => ({
  __esModule: true,
  default: { findById: jest.fn() }
}));
jest.mock("../../../models/CouponSystem/couponModel.js", () => ({
  Coupon: { findOne: jest.fn() },
  CouponUsage: { findOne: jest.fn(), create: jest.fn() }
}));
jest.mock("../../../models/Users.js", () => ({
  __esModule: true,
  default: { findById: jest.fn() }
}));
jest.mock("../../../config/firebaseConfig.js", () => ({
  messaging: () => ({
    send: jest.fn()
  })
}));

// Mock ApiResponse & ApiError behavior
jest.mock("../../../utils/ApiResponse.js", () => ({
  ApiResponse: function(status, data, message) {
    return { status, data, message };
  }
}));

jest.mock("../../../utils/ApiError.js", () => ({
  ApiError: class ApiError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
    }
  }
}));

// mock res object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("validateChatPayment Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PHONE_PE_HOST_URL = "https://phonepe.test";
    process.env.MERCHANT_ID = "MID123";
    process.env.SALT_KEY = "SALT123";
    process.env.SALT_INDEX = "1";
  });

  test("❌ should throw error if required params missing", async () => {
    const req = { query: {} };
    const res = mockResponse();

    await expect(validateChatPayment(req, res)).rejects.toThrow("Missing required parameters");
  });

  test("📌 should return existing subscription if already processed", async () => {
    const req = {
      query: { merchantTransactionId: "T1", userId: "U1", planId: "P1" }
    };
    const res = mockResponse();

    ChatUserPremium.findOne.mockResolvedValue({ _id: "EXISTING" });

    await validateChatPayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      data: { _id: "EXISTING" },
      message: "Payment already processed"
    });
  });

  test("✅ should create successful subscription when payment state COMPLETED", async () => {

    const req = {
      query: { merchantTransactionId: "TX123", userId: "U1", planId: "P1" }
    };
    const res = mockResponse();

    // No existing subscription
    ChatUserPremium.findOne.mockResolvedValue(null);

    // Mock PhonePe response
    axios.get.mockResolvedValue({
      data: {
        code: "PAYMENT_SUCCESS",
        data: { state: "COMPLETED", amount: 10000 }
      }
    });

    // Mock hashing
    sha256.mockReturnValue("HASHED");

    // Mock Plan
    ChatPremium.findById.mockResolvedValue({
      name: "Gold Plan",
      price: 100,
      chatsAllowed: 50,
      validityDays: 30
    });

    // Mock create subscription
    ChatUserPremium.create.mockResolvedValue({ _id: "NEW_SUB" });

    // Mock user for notification
    User.findById.mockResolvedValue({ deviceToken: "FCM123" });

    await validateChatPayment(req, res);

    expect(ChatUserPremium.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 200,
      data: { _id: "NEW_SUB" }
    }));
  });

  test("❗ should record failed subscription when payment FAILED", async () => {
    const req = {
      query: { merchantTransactionId: "TX123", userId: "U1", planId: "P1" }
    };
    const res = mockResponse();

    ChatUserPremium.findOne.mockResolvedValue(null);

    axios.get.mockResolvedValue({
      data: {
        code: "PAYMENT_FAILED",
        data: { state: "FAILED", amount: 10000 }
      }
    });

    ChatPremium.findById.mockResolvedValue({
      name: "Gold Plan",
      price: 100,
      chatsAllowed: 50,
      validityDays: 30
    });

    ChatUserPremium.create.mockResolvedValue({ _id: "FAILED_SUB" });
    User.findById.mockResolvedValue({ deviceToken: "FCM999" });

    await validateChatPayment(req, res);

    expect(ChatUserPremium.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

});
