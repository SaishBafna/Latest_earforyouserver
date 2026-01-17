import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import Meditation from "../../models/Meditation.js";
import { createMeditation, getMeditations } from "../../controllers/meditationController.js"; // adjust path

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());

  // Routes for testing
  app.post("/meditation", createMeditation);
  app.get("/meditation", getMeditations);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /meditation (createMeditation)", () => {
  it("should create a meditation successfully", async () => {
    const payload = {
      title: "Breathing Calm",
      description: "Deep breathing meditation",
      duration: 10,
    };

    const res = await request(app).post("/meditation").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Meditation created successfully");
    expect(res.body.newMeditation).toHaveProperty("title", payload.title);

    // Validate DB entry
    const item = await Meditation.findOne({ title: payload.title });
    expect(item).not.toBeNull();
  });

  it("should return 500 if body is missing required fields", async () => {
    const res = await request(app).post("/meditation").send({});

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Error creating meditation");
  });
});

describe("GET /meditation (getMeditations)", () => {
  beforeEach(async () => {
    await Meditation.deleteMany({});
    await Meditation.insertMany([
      { title: "Sleep Relax", description: "Helps sleep", duration: 15 },
      { title: "Stress Relief", description: "Reduces stress", duration: 12 },
      { title: "Focus Boost", description: "Improves focus", duration: 8 },
    ]);
  });

  it("should return paginated meditations", async () => {
    const res = await request(app).get("/meditation?page=1&limit=2");

    expect(res.statusCode).toBe(200);
    expect(res.body.meditations.length).toBe(2);
    expect(res.body).toHaveProperty("total", 3);
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("totalPages", 2);
  });

  it("should filter meditations by search query", async () => {
    const res = await request(app).get("/meditation?search=Stress");

    expect(res.statusCode).toBe(200);
    expect(res.body.meditations.length).toBe(1);
    expect(res.body.meditations[0].title).toBe("Stress Relief");
  });

  it("should return empty array if nothing matches search", async () => {
    const res = await request(app).get("/meditation?search=Unknown");

    expect(res.statusCode).toBe(200);
    expect(res.body.meditations.length).toBe(0);
    expect(res.body.total).toBe(0);
  });
});
