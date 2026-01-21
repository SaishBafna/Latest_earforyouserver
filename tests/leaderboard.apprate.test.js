import request from "supertest";
import app from "../app.js"; // adjust path to your Express main file

// Mock protect middleware so auth doesn't block tests (optional)
jest.mock("../../middlewares/auth/authMiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { _id: "mockUserId" }; // simulate authenticated user
    next();
  },
}));

// Mock controllers
jest.mock("../../controllers/LeaderBord/Apprate.js", () => ({
  addRating: jest.fn((req, res) =>
    res.status(201).json({ message: "Rating added" })
  ),
  getAllRatings: jest.fn((req, res) =>
    res.status(200).json({ data: ["rating1", "rating2"] })
  ),
  getMyRating: jest.fn((req, res) =>
    res.status(200).json({ data: "myRating" })
  ),
  updateRating: jest.fn((req, res) =>
    res.status(200).json({ message: "Rating updated" })
  ),
}));

describe("Leaderboard Rating Routes", () => {
  it("POST /leaderboard/comment should add rating", async () => {
    const res = await request(app)
      .post("/leaderboard/comment")
      .send({ comment: "Nice app", rating: 5 });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Rating added");
  });

  it("GET /leaderboard should get all ratings", async () => {
    const res = await request(app).get("/leaderboard");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(["rating1", "rating2"]);
  });

  it("GET /leaderboard/my should get user's rating", async () => {
    const res = await request(app).get("/leaderboard/my");

    expect(res.status).toBe(200);
    expect(res.body.data).toBe("myRating");
  });

  it("PUT /leaderboard should update rating", async () => {
    const res = await request(app)
      .put("/leaderboard")
      .send({ rating: 4 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rating updated");
  });
});
