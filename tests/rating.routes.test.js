import request from "supertest";
import express from "express";

// Import router
import ratingRoutes from "../src/routes/LeaderBoard/rating.routes.js";

// Mock protect middleware
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock("../src/controllers/LeaderBord/Apprate.js", () => ({
  addRating: jest.fn((req, res) => res.status(201).json({ route: "addRating" })),
  getAllRatings: jest.fn((req, res) => res.status(200).json({ route: "getAllRatings" })),
  getMyRating: jest.fn((req, res) => res.status(200).json({ route: "getMyRating" })),
  updateRating: jest.fn((req, res) => res.status(200).json({ route: "updateRating" })),
}));

// Setup express app for testing
const app = express();
app.use(express.json());
app.use("/rating", ratingRoutes);

describe("LeaderBoard Rating Routes", () => {

  test("POST /rating/comment → addRating", async () => {
    const res = await request(app)
      .post("/rating/comment")
      .send({ rating: 5, comment: "Nice work!" });

    expect(res.status).toBe(201);
    expect(res.body.route).toBe("addRating");
  });

  test("GET /rating → getAllRatings", async () => {
    const res = await request(app).get("/rating");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getAllRatings");
  });

  test("GET /rating/my → getMyRating", async () => {
    const res = await request(app).get("/rating/my");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getMyRating");
  });

  test("PUT /rating → updateRating", async () => {
    const res = await request(app)
      .put("/rating")
      .send({ rating: 4, comment: "Updated rating" });

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("updateRating");
  });

});
