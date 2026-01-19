/**
 * walletController.test.js
 */

import { deductPlanMinutes, deductPerMinute, getCallRate } from "../../../path/to/controller.js";

import Wallet from "../../../models/Wallet/Wallet.js";
import EarningWallet from "../../../models/Wallet/EarningWallet.js";
import User from "../../../models/Users.js";
import { CallRate } from "../../../models/Wallet/AdminCharges.js";
import CallRatePerMin from "../../../models/Wallet/RatePerMin.js";

import mongoose from "mongoose";

// Mock UUID
jest.mock("uuid", () => ({
  v4: jest.fn(() => "TEST-UUID")
}));

// Mock mongoose transaction/session
const mockSession = {
  startTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  endSession: jest.fn()
};

jest.mock("mongoose", () => ({
  startSession: jest.fn(() => mockSession)
}));

// Mock Models
jest.mock("../../../models/Wallet/Wallet.js", () => ({
  findOne: jest.fn(),
  save: jest.fn()
}));

jest.mock("../../../models/Wallet/EarningWallet.js", () => ({
  findOne: jest.fn(),
  save: jest.fn()
}));

jest.mock("../../../models/Users.js", () => ({
  findById: jest.fn()
}));

jest.mock("../../../models/Wallet/AdminCharges.js", () => ({
  CallRate: { findOne: jest.fn() }
}));

jest.mock("../../../models/Wallet/RatePerMin.js", () => ({
  findOne: jest.fn(),
  find: jest.fn()
}));

// Helper for res
const resMock = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("🔹 deductPlanMinutes()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ returns 400 for invalid input", async () => {
    const req = { body: { userId: null } };
    const res = resMock();

    await deductPlanMinutes(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ missing call rate config", async () => {
    mongoose.startSession.mockResolvedValue(mockSession);
    CallRate.findOne.mockResolvedValue(null);

    const req = { body: { userId: "U1", planId: "P1", minutesToDeduct: 5 } };
    const res = resMock();

    await deductPlanMinutes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: "Call rate configuration not found"
    }));
  });

  test("🟢 successful deduction", async () => {
    mongoose.startSession.mockResolvedValue(mockSession);

    CallRate.findOne.mockResolvedValue({
      ratePerMinute: 2,
      adminCommissionPercent: 10
    });

    Wallet.findOne
      .mockResolvedValueOnce({ // caller wallet
        userId: "U1",
        balance: 100,
        plans: [
          { planId: "P1", minutesLeft: 10, status: "active" }
        ],
        deductions: [],
        save: jest.fn()
      })
      .mockResolvedValueOnce({ // receiver wallet
        userId: "R1",
        balance: 50,
        recharges: [],
        save: jest.fn()
      });

    const req = { body: { userId: "U1", planId: "P1", minutesToDeduct: 3, receiverId: "R1" } };
    const res = resMock();

    await deductPlanMinutes(req, res);

    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe("🔸 deductPerMinute()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ invalid input", async () => {
    const req = { body: { callerId: null } };
    const res = resMock();

    await deductPerMinute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ receiver not found", async () => {
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findById.mockResolvedValue(null);

    const req = { body: { callerId: "C1", receiverId: "R1", durationInMinutes: 2 } };
    const res = resMock();

    await deductPerMinute(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 successful per minute deduction", async () => {
    mongoose.startSession.mockResolvedValue(mockSession);

    User.findById.mockResolvedValue({
      userType: "listener",
      userCategory: "premium"
    });

    CallRatePerMin.findOne.mockResolvedValue({
      ratePerMinute: 4,
      adminCommissionPercent: 10
    });

    Wallet.findOne.mockResolvedValue({
      userId: "C1",
      balance: 100,
      deductions: [],
      save: jest.fn()
    });

    EarningWallet.findOne.mockResolvedValue(null); // first time → create

    const req = { body: { callerId: "C1", receiverId: "R1", durationInMinutes: 5 } };
    const res = resMock();

    await deductPerMinute(req, res);

    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe("🔹 getCallRate()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("🟢 returns call rate list", async () => {
    CallRatePerMin.find.mockResolvedValue([{ ratePerMinute: 10 }]);

    const req = {};
    const res = resMock();

    await getCallRate(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
