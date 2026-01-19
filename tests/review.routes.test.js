import request from "supertest";
import express from "express";

// Import router
import reviewRoutes from "../src/routes/LeaderBoard/review.routes.js";

// Mock protect middleware
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock("../src/controllers/LeaderBord/reviewController.js", () => ({
  createReview: jest.fn((req, res) => res.status(201).json({ route: "createReview" })),
  updateReview: jest.fn((req, res) => res.status(200).json({ route: "updateReview" })),
  deleteReview: jest.fn((req, res) => res.status(200).json({ route: "deleteReview" })),
  getUserReviews: jest.fn((req, res) => res.status(200).json({ route: "getUserReviews" })),
  addCommentToReview: jest.fn((req, res) => res.status(201).json({ route: "addCommentToReview" })),
}));

// Setup Express app
const app = express();
app.use(express.json());
app.use("/review", reviewRoutes); // mount for testing

describe("Review Routes", () => {

  test("POST /review/reviews/:userId → createReview", async () => {
    const res = await request(app)
      .post("/review/reviews/12345")
      .send({ rating: 5, comment: "Nice!" });

    expect(res.status).toBe(201);
    expect(res.body.route).toBe("createReview");
  });

  test("POST /review/reviews/:reviewId/comment → addCommentToReview", async () => {
    const res = await request(app)
      .post("/review/reviews/abc123/comment")
      .send({ comment: "Thanks!" });

    expect(res.status).toBe(201);
    expect(res.body.route).toBe("addCommentToReview");
  });

  test("PUT /review/reviews/:reviewId → updateReview", async () => {
    const res = await request(app)
      .put("/review/reviews/abc123")
      .send({ rating: 4, comment: "Updated!" });

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("updateReview");
  });

  test("DELETE /review/reviews/:reviewId → deleteReview", async () => {
    const res = await request(app)
      .delete("/review/reviews/abc123");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("deleteReview");
  });

  test("GET /review/reviews/:user → getUserReviews", async () => {
    const res = await request(app).get("/review/reviews/999");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getUserReviews");
  });

});
