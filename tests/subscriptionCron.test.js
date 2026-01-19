// subscriptionCron.test.js
import cron from "node-cron";
import mongoose from "mongoose";
import { ChatUserPremium } from "../src/models/Subscriptionchat/ChatUserPremium.js";
import logger from "../src/logger/winston.logger.js";

// ===== MOCKS =====
jest.mock("node-cron", () => ({
  schedule: jest.fn()
}));

jest.mock("mongoose", () => ({
  startSession: jest.fn()
}));

jest.mock("../src/models/Subscriptionchat/ChatUserPremium.js", () => ({
  ChatUserPremium: {
    updateMany: jest.fn()
  }
}));

jest.mock("../src/logger/winston.logger.js", () => ({
  info: jest.fn(),
  error: jest.fn()
}));

// Import cron file AFTER mocks
import "../src/controllers/CronJob/Expiry.js"; // <-- adjust path

describe("Subscription Cron Job", () => {
  let mockSession;
  let scheduleCallback;

  beforeAll(() => {
    // Capture scheduled callback
    scheduleCallback = cron.schedule.mock.calls[0][1];

    // Mock session with transaction behavior
    mockSession = {
      withTransaction: jest.fn((fn) => fn()),
      endSession: jest.fn()
    };

    mongoose.startSession.mockResolvedValue(mockSession);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should deactivate expired subscriptions", async () => {
    ChatUserPremium.updateMany.mockResolvedValue({
      modifiedCount: 2
    });

    await scheduleCallback();

    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.withTransaction).toHaveBeenCalled();

    expect(ChatUserPremium.updateMany).toHaveBeenCalledWith(
      {
        expiryDate: { $lt: expect.any(Date) },
        isActive: true,
      },
      { $set: { isActive: false } },
      { session: mockSession }
    );

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("[SubscriptionCron] Deactivated 2 subscriptions"));
    expect(mockSession.endSession).toHaveBeenCalled();
  });

  test("should log when no subscriptions expired", async () => {
    ChatUserPremium.updateMany.mockResolvedValue({
      modifiedCount: 0
    });

    await scheduleCallback();

    expect(logger.info).toHaveBeenCalledWith("[SubscriptionCron] No expired subscriptions found");
  });

  test("should handle errors", async () => {
    const error = new Error("DB failure");

    ChatUserPremium.updateMany.mockRejectedValue(error);

    await scheduleCallback();

    expect(logger.error).toHaveBeenCalledWith("[SubscriptionCron] Error:", error);
  });
});
