import request from "supertest";
import express from "express";
import router from "../src/routes/callRoutes.js"; // <-- update path as needed

// Mock the protect middleware to always pass
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => {
    // Mock user info
    req.user = { _id: "mockUser123" };
    next();
  }),
}));

// Mock Controllers
jest.mock("../src/controllers/CallController/CallController.js", () => ({
  getRecentCalls: jest.fn((req, res) => res.status(200).json({ calls: [] })),
  initiateCall: jest.fn((req, res) => res.status(200).json({ message: "Call initiated" })),
  acceptCall: jest.fn((req, res) => res.status(200).json({ message: "Call accepted" })),
  rejectCall: jest.fn((req, res) => res.status(200).json({ message: "Call rejected" })),
  endCall: jest.fn((req, res) => res.status(200).json({ message: "Call ended" })),
  handleMissedCall: jest.fn((req, res) => res.status(200).json({ message: "Missed call logged" })),
}));

const app = express();
app.use(express.json());
app.use("/call", router); // base path for calling APIs

describe("Call Routes API", () => {

  test("GET /call/recent-calls → should return recent calls", async () => {
    const res = await request(app).get("/call/recent-calls");
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ calls: [] });
  });

  test("POST /call/initiate → should initiate a call", async () => {
    const res = await request(app)
      .post("/call/initiate")
      .send({ receiverId: "user123" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Call initiated" });
  });

  test("POST /call/accept → should accept a call", async () => {
    const res = await request(app)
      .post("/call/accept")
      .send({ callId: "callABC" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Call accepted" });
  });

  test("POST /call/reject → should reject a call", async () => {
    const res = await request(app)
      .post("/call/reject")
      .send({ callId: "callABC" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Call rejected" });
  });

  test("POST /call/end → should end an ongoing call", async () => {
    const res = await request(app)
      .post("/call/end")
      .send({ callId: "callABC" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Call ended" });
  });

  test("POST /call/missed → should log a missed call", async () => {
    const res = await request(app)
      .post("/call/missed")
      .send({ callerId: "user123", receiverId: "user456" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Missed call logged" });
  });

});
