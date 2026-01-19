import request from "supertest";
import express from "express";

// Import router
import couponRoutes from "../src/routes/Coupon/coupon.routes.js";

// Mock protect middleware
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock("../src/controllers/CouponController/couponController.js", () => ({
  createCoupon: jest.fn((req, res) => res.status(201).json({ route: "createCoupon" })),
  validateCoupon: jest.fn((req, res) => res.status(200).json({ route: "validateCoupon" })),
  recordUsage: jest.fn((req, res) => res.status(200).json({ route: "recordUsage" })),
  getUserCoupons: jest.fn((req, res) => res.status(200).json({ route: "getUserCoupons" })),
  getAllCoupons: jest.fn((req, res) => res.status(200).json({ route: "getAllCoupons" })),
  toggleCouponStatus: jest.fn((req, res) => res.status(200).json({ route: "toggleCouponStatus" })),
}));

// Setup test app
const app = express();
app.use(express.json());
app.use("/coupon", couponRoutes);

describe("Coupon Routes", () => {

  test("POST /coupon/coupon → createCoupon", async () => {
    const res = await request(app)
      .post("/coupon/coupon")
      .send({ name: "DISCOUNT10" });

    expect(res.status).toBe(201);
    expect(res.body.route).toBe("createCoupon");
  });

  test("POST /coupon/coupon/validate → validateCoupon", async () => {
    const res = await request(app)
      .post("/coupon/coupon/validate")
      .send({ coupon: "DISCOUNT10" });

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("validateCoupon");
  });

  test("POST /coupon/coupon/usage → recordUsage", async () => {
    const res = await request(app)
      .post("/coupon/coupon/usage")
      .send({ coupon: "DISCOUNT10" });

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("recordUsage");
  });

  test("GET /coupon/coupon/my-coupons → getUserCoupons", async () => {
    const res = await request(app).get("/coupon/coupon/my-coupons");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getUserCoupons");
  });

  // If you later re-enable admin routes, uncomment this block:

  // test("GET /coupon → getAllCoupons", async () => {
  //   const res = await request(app).get("/coupon");
  //   expect(res.status).toBe(200);
  //   expect(res.body.route).toBe("getAllCoupons");
  // });

  // test("PUT /coupon/:id/toggle → toggleCouponStatus", async () => {
  //   const res = await request(app).put("/coupon/123/toggle");
  //   expect(res.status).toBe(200);
  //   expect(res.body.route).toBe("toggleCouponStatus");
  // });

});
