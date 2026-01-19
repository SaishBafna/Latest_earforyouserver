/**
 * paymentWalletController.test.js
 */

import {
  validatePayment,
  getRechargeHistory,
  getEarningHistory,
  getAllPlans,
  transferEarningsToWallet
} from "../src/controllers/Recharge/RechargeWallet.js";

import axios from "axios";
import sha256 from "sha256";
import mongoose from "mongoose";
import Wallet from "../src/models/Wallet/Wallet.js";
import EarningWallet from "../src/models/Wallet/EarningWallet.js";
import SubscriptionPlan from "../src/models/Subscription/Subscription.js";
import User from "../src/models/Users.js";
import { Coupon, CouponUsage } from "../src/models/CouponSystem/couponModel.js";

// ================================
// MOCKS
// ================================
jest.mock("axios");
jest.mock("sha256");
jest.mock("../src/models/Wallet/Wallet.js");
jest.mock("../src/models/Wallet/EarningWallet.js");
jest.mock("../src/models/Subscription/Subscription.js");
jest.mock("../src/models/Users.js");
jest.mock("../src/models/CouponSystem/couponModel.js", () => ({
  Coupon: { findOne: jest.fn() },
  CouponUsage: { findOne: jest.fn(), create: jest.fn() }
}));
jest.mock("../src/config/firebaseConfig.js", () => ({
  messaging: () => ({
    send: jest.fn()
  })
}));

const mockSession = {
  startTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  endSession: jest.fn()
};

jest.mock("mongoose", () => ({
  startSession: jest.fn(() => mockSession)
}));

// Response helper
const resMock = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn();
  res.json = jest.fn();
  return res;
};

// ===============================================================
// VALIDATE PAYMENT TESTS
// ===============================================================

describe("🔹 validatePayment()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ Missing required fields", async () => {
    const req = { query: {} };
    const res = resMock();

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ Invalid plan ID", async () => {
    const req = { query: { merchantTransactionId: "TX", userId: "U1", planId: "P1" } };
    const res = resMock();

    SubscriptionPlan.findById.mockResolvedValue(null);

    axios.get.mockResolvedValue({
      data: { code: "PAYMENT_SUCCESS", data: { state: "COMPLETED", amount: 10000 } }
    });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Invalid plan ID");
  });

  test("🟢 Successful COMPLETED payment (no coupon)", async () => {
    const req = { query: { merchantTransactionId: "TX123", userId: "U1", planId: "P1" } };
    const res = resMock();

    Coupon.findOne.mockResolvedValue(null);
    sha256.mockReturnValue("HASHED");

    axios.get.mockResolvedValue({
      data: { code: "PAYMENT_SUCCESS", data: { state: "COMPLETED", amount: 10000, paymentInstrument: {} } }
    });

    SubscriptionPlan.findById.mockResolvedValue({
      price: 100,
      talkTime: 50
    });

    User.findById.mockResolvedValue({ deviceToken: "FCM_TOKEN" });

    Wallet.findOne.mockResolvedValue({
      balance: 0,
      recharges: [],
      plan: [],
      save: jest.fn()
    });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: "Payment validated and wallet updated"
    }));
  });

  test("⌛ Pending payment", async () => {
    const req = { query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" } };
    const res = resMock();

    axios.get.mockResolvedValue({
      data: { code: "PAYMENT_PENDING", data: { state: "PENDING", amount: 10000 } }
    });

    SubscriptionPlan.findById.mockResolvedValue({ price: 100, talkTime: 50 });
    Wallet.findOne.mockResolvedValue({ recharges: [], save: jest.fn() });
    User.findById.mockResolvedValue({ deviceToken: "TOKEN" });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("❗ Failed payment", async () => {
    const req = { query: { merchantTransactionId: "TX1", userId: "U1", planId: "P1" } };
    const res = resMock();

    axios.get.mockResolvedValue({
      data: { code: "PAYMENT_FAILED", data: { state: "FAILED", amount: 10000 } }
    });

    SubscriptionPlan.findById.mockResolvedValue({ price: 100, talkTime: 50 });
    Wallet.findOne.mockResolvedValue({ recharges: [], save: jest.fn() });
    User.findById.mockResolvedValue({ deviceToken: "TOKEN" });

    await validatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// ===============================================================
// RECHARGE HISTORY
// ===============================================================

describe("🔸 getRechargeHistory()", () => {
  test("❌ Wallet not found", async () => {
    const req = { params: { userId: "U1" } };
    const res = resMock();

    Wallet.findOne.mockResolvedValue(null);

    await getRechargeHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 Returns recharge history", async () => {
    Wallet.findOne.mockResolvedValue({ recharges: [1,2,3], balance: 100 });

    const req = { params: { userId: "U1" } };
    const res = resMock();

    await getRechargeHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ===============================================================
// EARNING HISTORY
// ===============================================================

describe("🔸 getEarningHistory()", () => {
  test("❌ No earning wallet", async () => {
    const req = { params: { userId: "U1" } };
    const res = resMock();

    EarningWallet.findOne.mockResolvedValue(null);

    await getEarningHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 Returns earning history", async () => {
    EarningWallet.findOne.mockResolvedValue({ earnings: [1,2,3], balance: 200 });

    const req = { params: { userId: "U1" } };
    const res = resMock();

    await getEarningHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ===============================================================
// GET ALL PLANS
// ===============================================================

describe("🔹 getAllPlans()", () => {
  test("❌ No plans found", async () => {
    SubscriptionPlan.find.mockResolvedValue([]);

    const req = {};
    const res = resMock();

    await getAllPlans(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 Returns plans", async () => {
    SubscriptionPlan.find.mockResolvedValue([{ plan: "Basic" }]);

    const req = {};
    const res = resMock();

    await getAllPlans(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ===============================================================
// TRANSFER EARNINGS
// ===============================================================

describe("🔹 transferEarningsToWallet()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ Insufficient params", async () => {
    const req = { user: {}, body: {} };
    const res = resMock();

    await transferEarningsToWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ Earning wallet not found", async () => {
    mongoose.startSession.mockResolvedValue(mockSession);

    const req = { user: { _id: "U1" }, body: { amount: 10 } };
    const res = resMock();

    EarningWallet.findOne.mockResolvedValue(null);

    await transferEarningsToWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 Successful transfer", async () => {
    mongoose.startSession.mockResolvedValue(mockSession);

    EarningWallet.findOne.mockResolvedValue({
      userId: "U1",
      balance: 100,
      deductions: [],
      save: jest.fn()
    });

    Wallet.findOne.mockResolvedValue({
      userId: "U1",
      balance: 50,
      recharges: [],
      save: jest.fn()
    });

    User.findById.mockResolvedValue({ deviceToken: "TOK" });

    const req = { user: { _id: "U1" }, body: { amount: 30 } };
    const res = resMock();

    await transferEarningsToWallet(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockSession.commitTransaction).toHaveBeenCalled();
  });
});
