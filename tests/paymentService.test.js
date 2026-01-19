/**
 * @jest-environment node
 */

import { paymentService } from "../src/services/paymentService.js";
import Razorpay from "razorpay";
import crypto from "crypto";

jest.mock("razorpay");
jest.mock("crypto");
jest.mock("../src/models/Subscriptionchat/ChatPremium.js", () => ({
  findById: jest.fn()
}));
jest.mock("../src/models/Subscriptionchat/ChatUserPremium.js", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn()
}));
jest.mock("../src/models/CouponSystem/couponModel.js", () => ({
  Coupon: {
    findOne: jest.fn()
  },
  CouponUsage: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));
jest.mock("../src/models/Users.js", () => ({
  findById: jest.fn()
}));
jest.mock("../src/config/firebaseConfig.js", () => ({
  messaging: () => ({
    send: jest.fn()
  })
}));

describe("paymentService Tests", () => {
  const mockOrder = {
    id: "order_123",
    amount: 10000,
    currency: "INR",
    notes: {}
  };

  beforeEach(() => {
    Razorpay.mockImplementation(() => ({
      orders: {
        create: jest.fn().mockResolvedValue(mockOrder),
        fetch: jest.fn().mockResolvedValue({
          notes: { originalAmount: 100, discountAmount: 0 }
        })
      },
      payments: {
        fetch: jest.fn().mockResolvedValue({ status: "captured", id: "pay_123" }),
        capture: jest.fn()
      }
    }));
  });

  test("createOrder() should create Razorpay order successfully", async () => {
    const ChatPremium = require("../../models/Subscriptionchat/ChatPremium.js");
    ChatPremium.findById.mockResolvedValue({
      _id: "plan123",
      name: "Gold Plan",
      price: 100,
      chatsAllowed: 50,
      validityDays: 30
    });

    const order = await paymentService.createOrder("user123", "plan123", null);

    expect(order).toHaveProperty("id", "order_123");
    expect(order).toHaveProperty("amount", 100);
    expect(order.plan.name).toBe("Gold Plan");
  });

  test("verifyAndActivate() should fail with invalid payment data", async () => {
    await expect(
      paymentService.verifyAndActivate("user123", "plan123", {}, null)
    ).rejects.toThrow("Invalid payment data provided");
  });

  test("validatePayment() should throw on invalid signature", () => {
    crypto.createHmac.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("invalid_signature")
    });

    expect(() =>
      paymentService.validatePayment({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_123",
        razorpay_signature: "not_matching"
      })
    ).toThrow("Payment validation failed");
  });

  test("handleWebhook() should call handler for valid event", async () => {
    const payload = {
      payment: { entity: { id: "pay_123" } }
    };

    paymentService.handlePaymentSuccess = jest.fn().mockResolvedValue({});
    paymentService.handlePaymentFailure = jest.fn().mockResolvedValue({});

    await paymentService.handleWebhook({
      body: { event: "payment.captured", payload }
    });

    expect(paymentService.handlePaymentSuccess).toHaveBeenCalled();
  });

  test("handleWebhook() should ignore unhandled event", async () => {
    console.log = jest.fn();

    await paymentService.handleWebhook({
      body: { event: "unknown.event", payload: {} }
    });

    expect(console.log).toHaveBeenCalledWith("Unhandled webhook event: unknown.event");
  });
});
