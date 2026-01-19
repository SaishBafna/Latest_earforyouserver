/**
 * TEST FILE: validatePayment.test.js
 */

import { validatePayment } from "../src/controllers/Recharge/RechargeWallet.js";
import PlatformCharges from "../src/models/Wallet/PlatfromCharges/Platfrom.js";
import MyPlan from "../src/models/Wallet/PlatfromCharges/myPlanSchema.js";
import User from "../src/models/Users.js";
import { Coupon, CouponUsage } from "../src/models/CouponSystem/couponModel.js";

import axios from "axios";
import admin from "../src/config/firebaseConfig.js";
import { createHash } from "crypto";

jest.mock("axios");
jest.mock("crypto", () => ({
  createHash: jest.fn()
}));
jest.mock("../src/models/Wallet/PlatfromCharges/Platfrom.js", () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));
jest.mock("../src/models/Wallet/PlatfromCharges/myPlanSchema.js", () => ({
  findById: jest.fn()
}));
jest.mock("../src/models/Users.js", () => ({
  findById: jest.fn()
}));
jest.mock("../src/models/CouponSystem/couponModel.js", () => ({
  Coupon: { findOne: jest.fn() },
  CouponUsage: { findOne: jest.fn(), create: jest.fn() }
}));
jest.mock("../src/config/firebaseConfig.js", () => ({
  messaging: () => ({
    send: jest.fn()
  })
}));

// mock response helper
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

// Setup env vars for hashing
beforeEach(() => {
  jest.clearAllMocks();
  process.env.PHONE_PE_HOST_URL = "https://phonepe.test";
  process.env.MERCHANT_ID = "MID123";
  process.env.SALT_KEY = "SALT123";
  process.env.SALT_INDEX = "1";
});

describe("validatePayment()", () => {

  test("❌ Missing required query parameters", async () => {
    const req = { query: {} };
    const res = mockRes();

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  test("❌ Plan not found", async () => {
    const req = {
      query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" }
    };
    const res = mockRes();

    MyPlan.findById.mockResolvedValue(null);

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("❌ Duplicate transaction", async () => {
    const req = {
      query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" }
    };
    const res = mockRes();

    MyPlan.findById.mockResolvedValue({ validityDays: 30, amount: 100 });
    PlatformCharges.findOne.mockResolvedValue({ status: "success" });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false, error: "Transaction already exists"
    }));
  });

  test("💳 Successful payment → Active plan", async () => {
    const req = {
      query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" }
    };
    const res = mockRes();

    MyPlan.findById.mockResolvedValue({ validityDays: 30, amount: 100 });
    PlatformCharges.findOne.mockResolvedValue(null);
    Coupon.findOne.mockResolvedValue(null);
    User.findById.mockResolvedValue({ deviceToken: "FCM123" });

    // mock hash
    const mockDigest = jest.fn().mockReturnValue("HASHED123");
    createHash.mockReturnValue({ update: () => ({ digest: mockDigest }) });

    // mock PhonePe response
    axios.get.mockResolvedValue({
      data: {
        success: true,
        code: "PAYMENT_SUCCESS",
        data: { state: "COMPLETED" }
      }
    });

    PlatformCharges.create.mockResolvedValue({
      _id: "NEW_TX",
      status: "active"
    });

    await validatePayment(req, res);

    expect(PlatformCharges.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: expect.stringContaining("successful")
    }));
  });

  test("⌛ Pending payment", async () => {
    const req = {
      query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" }
    };
    const res = mockRes();

    MyPlan.findById.mockResolvedValue({ validityDays: 30, amount: 100 });
    PlatformCharges.findOne.mockResolvedValue(null);
    User.findById.mockResolvedValue({ deviceToken: "FCM123" });

    createHash.mockReturnValue({
      update: () => ({ digest: () => "HASHED" })
    });

    axios.get.mockResolvedValue({
      data: {
        success: true,
        code: "PAYMENT_PENDING",
        data: { state: "PENDING" }
      }
    });

    PlatformCharges.create.mockResolvedValue({ _id: "PENDING_TX" });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(202);
  });

  test("❗ Failed payment", async () => {
    const req = {
      query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" }
    };
    const res = mockRes();

    MyPlan.findById.mockResolvedValue({ validityDays: 30, amount: 100 });
    PlatformCharges.findOne.mockResolvedValue(null);
    User.findById.mockResolvedValue({ deviceToken: "FCM123" });

    createHash.mockReturnValue({
      update: () => ({ digest: () => "HASHED" })
    });

    axios.get.mockResolvedValue({
      data: {
        success: true,
        code: "PAYMENT_FAILED",
        data: { state: "FAILED" }
      }
    });

    PlatformCharges.create.mockResolvedValue({ _id: "FAILED_TX" });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

});
