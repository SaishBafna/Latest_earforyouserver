import request from "supertest";
import express from "express";

// Import router
import chatPaymentRoutes from "../src/routes/Recharge/ChatPayment.routes.js";

// Mock controllers
jest.mock("../src/controllers/Recharge/ChatRecharge/ChatPayment.js", () => ({
  createChatPremium: jest.fn((req, res) => res.status(201).json({ route: "createChatPremium" })),
  getAllChatPremiumPlans: jest.fn((req, res) => res.status(200).json({ route: "getAllChatPremiumPlans" })),
  validateChatPayment: jest.fn((req, res) => res.status(200).json({ route: "validateChatPayment" })),
  getPremiumUserDetails: jest.fn((req, res) => res.status(200).json({ route: "getPremiumUserDetails" })),
}));

// Mock middleware
jest.mock("../src/middlewares/Copunmiddleware/ValidateCopun.js", () => ({
  validateCoupon: jest.fn((req, res, next) => res.status(200).json({ route: "validateCoupon" })),
}));

// Setup test server
const app = express();
app.use(express.json());
app.use("/chatPayment", chatPaymentRoutes);

describe("Chat Payment Routes", () => {

  test("POST /chatPayment/createChatPremium → createChatPremium", async () => {
    const res = await request(app)
      .post("/chatPayment/createChatPremium")
      .send({});
    
    expect(res.status).toBe(201);
    expect(res.body.route).toBe("createChatPremium");
  });

  test("GET /chatPayment/getAllChatPremiumPlans → getAllChatPremiumPlans", async () => {
    const res = await request(app).get("/chatPayment/getAllChatPremiumPlans");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getAllChatPremiumPlans");
  });

  test("POST /chatPayment/validateChatPayment → validateChatPayment", async () => {
    const res = await request(app)
      .post("/chatPayment/validateChatPayment")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("validateChatPayment");
  });

  test("POST /chatPayment/validateCoupon → validateCoupon middleware", async () => {
    const res = await request(app).post("/chatPayment/validateCoupon").send({});

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("validateCoupon");
  });

  test("GET /chatPayment/getPremiumUserDetails/:userId → getPremiumUserDetails", async () => {
    const res = await request(app).get("/chatPayment/getPremiumUserDetails/1234");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getPremiumUserDetails");
  });

});
