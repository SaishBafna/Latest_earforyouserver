import request from "supertest";
import express from "express";
import router from "../src/routes/BlockUserRoute"; // update path as needed

// MOCK CONTROLLERS
jest.mock("../src/controllers/BlockUser/BlockController.js", () => ({
  blockUser: jest.fn((req, res) => res.status(200).json({ message: "User blocked" })),
  unblockUser: jest.fn((req, res) => res.status(200).json({ message: "User unblocked" })),
  checkBlockStatus: jest.fn((req, res) => res.status(200).json({ blocked: false })),
  getBlockedUsers: jest.fn((req, res) =>
    res.status(200).json({ blockedUsers: [{ _id: "123", username: "John" }] })
  ),
}));

const app = express();
app.use(express.json());
app.use("/block", router);

describe("Block Routes API", () => {
  test("POST /block → should block a user", async () => {
    const res = await request(app)
      .post("/block/block")
      .send({ userId: "123", blockedId: "456" });
      
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User blocked" });
  });

  test("POST /block/unblock → should unblock a user", async () => {
    const res = await request(app)
      .post("/block/unblock")
      .send({ userId: "123", blockedId: "456" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "User unblocked" });
  });

  test("GET /block/check → should return blocking status", async () => {
    const res = await request(app).get("/block/check?userId=123&blockedId=456");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ blocked: false });
  });

  test("GET /block/blocked-users/:userId → should return list of blocked users", async () => {
    const res = await request(app).get("/block/blocked-users/123");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      blockedUsers: [{ _id: "123", username: "John" }],
    });
  });
});
