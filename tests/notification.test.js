import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import Notification from "../src/models/Notification.Modal.js";
import User from "../src/models/User.model.js"; // adjust path if different
import { getNotifications } from "../src/controllers/firebase/GetNotificaton.js"; // adjust path

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  app = express();
  app.get("/notifications", getNotifications);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /notifications", () => {
  it("should return formatted notifications with populated user names", async () => {
    // 1. Create a mock user
    const user = await User.create({ name: "John Doe", email: "john@example.com" });

    // 2. Create a mock notification
    await Notification.create({
      title: "Test Title",
      messageBody: "Test message",
      userId: user._id,
      createdAt: new Date("2024-01-01T10:00:00Z"),
    });

    // 3. Call API
    const res = await request(app).get("/notifications");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("name", "John Doe");
    expect(res.body[0]).toHaveProperty("title", "Test Title");
    expect(res.body[0]).toHaveProperty("messageBody", "Test message");
    expect(res.body[0]).toHaveProperty("date"); // formatted date
  });

  it("should return empty array if no notifications exist", async () => {
    await Notification.deleteMany({});

    const res = await request(app).get("/notifications");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
