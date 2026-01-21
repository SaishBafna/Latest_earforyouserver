import request from "supertest";
import express from "express";
import router from "../src/routes/Recharge/RechargeRoute"; // <-- update path

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
// MOCK CONTROLLERS
// ----------------------
jest.mock("../src/controllers/Recharge/RechargeWallet.js", () => ({
  validatePayment: jest.fn((req, res) =>
    res.status(200).json({ message: "Payment validated" })
  ),
  getRechargeHistory: jest.fn((req, res) =>
    res.status(200).json({ history: [] })
  ),
  getAllPlans: jest.fn((req, res) =>
    res.status(200).json({ plans: [] })
  ),
  transferEarningsToWallet: jest.fn((req, res) =>
    res.status(200).json({ message: "Earnings transferred" })
  ),
  getEarningHistory: jest.fn((req, res) =>
    res.status(200).json({ earnings: [] })
  ),
}));

jest.mock("../src/controllers/Recharge/Decudition.js", () => ({
  deductPerMinute: jest.fn((req, res) =>
    res.status(200).json({ message: "Deduction processed" })
  ),
  getCallRate: jest.fn((req, res) =>
    res.status(200).json({ rate: 10 })
  ),
}));

jest.mock("../src/controllers/Withdrawal/Withdrawal.js", () => ({
  requestWithdrawal: jest.fn((req, res) =>
    res.status(200).json({ message: "Withdrawal requested" })
  ),
  getWithdrawal: jest.fn((req, res) =>
    res.status(200).json({ withdrawals: [] })
  ),
}));

jest.mock("../src/controllers/Recharge/RatePerMinController.js", () => ({
  createCallRate: jest.fn((req, res) =>
    res.status(200).json({ message: "Call rate created" })
  ),
  updateCallRate: jest.fn((req, res) =>
    res.status(200).json({ message: "Call rate updated" })
  ),
  getAllCallRates: jest.fn((req, res) =>
    res.status(200).json({ rates: [] })
  ),
  getCallRateByCategory: jest.fn((req, res) =>
    res.status(200).json({ categoryRates: [] })
  ),
}));

// App instance
const app = express();
app.use(express.json());
app.use("/wallet", router); // mount route for testing

describe("Recharge & Wallet Routes", () => {

  test("GET /wallet/getCallRate → should return call rate", async () => {
    const res = await request(app).get("/wallet/getCallRate");
    expect(res.status).toBe(200);
    expect(res.body.rate).toBe(10);
  });

  test("POST /wallet/validate → should validate payment", async () => {
    const res = await request(app)
      .post("/wallet/validate")
      .send({ amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Payment validated");
  });

  test("GET /wallet/getAllPlans → should return plans", async () => {
    const res = await request(app).get("/wallet/getAllPlans");
    expect(res.status).toBe(200);
    expect(res.body.plans).toEqual([]);
  });

  test("POST /wallet/recharges/:userId → should return recharge history", async () => {
    const res = await request(app)
      .post("/wallet/recharges/123")
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.history).toEqual([]);
  });

  test("POST /wallet/earning/:userId → should return earning history", async () => {
    const res = await request(app)
      .post("/wallet/earning/123")
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.earnings).toEqual([]);
  });

  test("POST /wallet/deductPerMinute → should deduct per minute", async () => {
    const res = await request(app)
      .post("/wallet/deductPerMinute")
      .send({ minutes: 5 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deduction processed");
  });

  test("POST /wallet/transferEarningsToWallet → should transfer earnings", async () => {
    const res = await request(app)
      .post("/wallet/transferEarningsToWallet")
      .send({ amount: 100 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Earnings transferred");
  });

  test("POST /wallet/requestWithdrawal → should request withdrawal", async () => {
    const res = await request(app)
      .post("/wallet/requestWithdrawal")
      .send({ amount: 200 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Withdrawal requested");
  });

  test("GET /wallet/getWithdrawal → should return withdrawals", async () => {
    const res = await request(app).get("/wallet/getWithdrawal");
    expect(res.status).toBe(200);
    expect(res.body.withdrawals).toEqual([]);
  });

  test("POST /wallet/create → should create call rate", async () => {
    const res = await request(app)
      .post("/wallet/create")
      .send({ category: "expert", rate: 15 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Call rate created");
  });

  test("PUT /wallet/update → should update call rate", async () => {
    const res = await request(app)
      .put("/wallet/update")
      .send({ category: "expert", rate: 20 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Call rate updated");
  });

  test("GET /wallet/all → should return all call rates", async () => {
    const res = await request(app).get("/wallet/all");
    expect(res.status).toBe(200);
    expect(res.body.rates).toEqual([]);
  });

  test("GET /wallet/category → should return category rates", async () => {
    const res = await request(app).get("/wallet/category");
    expect(res.status).toBe(200);
    expect(res.body.categoryRates).toEqual([]);
  });
});
