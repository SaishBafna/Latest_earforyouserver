import request from "supertest";
import express from "express";
import router from "../src/routes/RazorPayRoute/PlatfromRazorpayroute"; // <-- update path as needed

// Mock the protect middleware to bypass auth
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: "mockUser123" };
    next();
  }),
}));

// Mock Controller functions
jest.mock("../src/controllers/Razorpay/PlatFromRazorPay.js", () => ({
  createOrder: jest.fn((req, res) =>
    res.status(200).json({ message: "Order created" })
  ),
  verifyPayment: jest.fn((req, res) =>
    res.status(200).json({ message: "Payment verified" })
  ),
  handleWebhook: jest.fn((req, res) =>
    res.status(200).json({ message: "Webhook handled" })
  ),
}));

const app = express();
app.use(express.json());
app.use("/payment", router); // mount router under `/payment` for testing

describe("Platform Razorpay Routes", () => {
  // -----------------------------
  // TEST: Create Order
  // -----------------------------
  test("POST /payment/platfrom/create-order → should create order", async () => {
    const res = await request(app)
      .post("/payment/platfrom/create-order")
      .send({ planId: "basic", amount: 200 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order created");
  });

  // -----------------------------
  // TEST: Verify Payment
  // -----------------------------
  test("POST /payment/platfrom/verify → should verify payment", async () => {
    const res = await request(app)
      .post("/payment/platfrom/verify")
      .send({ orderId: "order_123", paymentId: "pay_456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Payment verified");
  });

  // -----------------------------
  // TEST: Webhook Handling
  // -----------------------------
  test("POST /payment/platfrom/webhook → should handle webhook", async () => {
    const rawJson = JSON.stringify({
      event: "payment.captured",
      payload: { payment: { id: "pay_456" } },
    });

    const res = await request(app)
      .post("/payment/platfrom/webhook")
      .set("Content-Type", "application/json")
      .send(rawJson);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Webhook handled");
  });
});
