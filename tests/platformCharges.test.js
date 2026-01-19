import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import PlatformCharges from "../src/models/Wallet/PlatfromCharges/Platfrom.js"; // adjust path
import { expirePlatformCharges } from "../src/controllers/CronJob/Expiry.js"; // adjust path

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.get("/expire-platform-charges", expirePlatformCharges);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("GET /expire-platform-charges", () => {
  it("should activate queued plans and expire active plans for today", async () => {
    const now = new Date();

    // Create queued plan → should become active
    await PlatformCharges.create({
      status: "queued",
      startDate: now,
      endDate: new Date(now.getTime() + 86400000)
    });

    // Create active plan → should become expired
    await PlatformCharges.create({
      status: "active",
      startDate: new Date(now.getTime() - 86400000),
      endDate: now
    });

    const res = await request(app).get("/expire-platform-charges");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("activateResult");
    expect(res.body).toHaveProperty("expireResult");

    // Validate DB changes
    const active = await PlatformCharges.countDocuments({ status: "active" });
    const expired = await PlatformCharges.countDocuments({ status: "expired" });

    expect(active).toBe(1);
    expect(expired).toBe(1);
  });

  it("should return success even if no records match", async () => {
    await PlatformCharges.deleteMany({});

    const res = await request(app).get("/expire-platform-charges");

    expect(res.statusCode).toBe(200);
    expect(res.body.activateResult.modifiedCount).toBe(0);
    expect(res.body.expireResult.modifiedCount).toBe(0);
  });
});
