import request from "supertest";
import express from "express";
import router from "../src/routes/RazorPayRoute/ChatRazorpayRoute"; // update path as needed

// ----------------------
// MOCK MIDDLEWARE
// ----------------------
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: "mockUser123" };
    next();
  }),
}));

// ----------------------
// MOCK SERVICE
// ----------------------
jest.mock("../src/controllers/Razorpay/ChatRazorpay.js", () => ({
  paymentService: {
    createOrder: jest.fn(() => ({ orderId: "order_123", amount: 200 })),
    verifyAndActivate: jest.fn(() => ({ subscriptionId: "sub_123" })),
    verifyWebhookSignature: jest.fn(),
    handleWebhook: jest.fn(),
  },
}));

// Setup Express app for tests
const app = express();

// normal JSON for standard routes
app.use(express.json());

// RAW JSON for webhook route (matches your router behavior)
app.use("/payment", router);

describe("Razorpay Payment Routes", () => {

  // ----------------------
  // TEST: create order
  // ----------------------
  test("POST /payment/create-order → should create order", async () => {
    const res = await request(app)
      .post("/payment/create-order")
      .send({ planId: "basic", couponCode: "SAVE10" });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ orderId: "order_123", amount: 200 });
    expect(res.body.message).toBe("Order created successfully");
  });

  // ----------------------
  // TEST: verify payment
  // ----------------------
  test("POST /payment/verify → should verify and activate subscription", async () => {
    const res = await request(app)
      .post("/payment/verify")
      .send({
        planId: "basic",
        payment: { payment_id: "pay_123" },
        couponCode: "SAVE10",
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ subscriptionId: "sub_123" });
    expect(res.body.message).toBe("Payment verified and subscription activated");
  });

  // ----------------------
  // TEST: missing fields
  // ----------------------
  test("POST /payment/verify → should fail without payment data", async () => {
    const res = await request(app)
      .post("/payment/verify")
      .send({ planId: "basic" }); // missing "payment"

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Plan ID and payment data are required/);
  });

  // ----------------------
  // TEST: webhook
  // ----------------------
  test("POST /payment/razorwebhook → should process webhook", async () => {
    const rawJson = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_123" } } },
    });

    const res = await request(app)
      .post("/payment/razorwebhook")
      .set("Content-Type", "application/json")
      .send(rawJson);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Webhook processed successfully");
  });

});
