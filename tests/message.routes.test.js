import request from "supertest";
import express from "express";

// Import router
import messageRoutes from "../src/routes/chat-app/message.routes.js";

// Mock protect middleware
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => next()),
}));

// Mock multer
jest.mock("../src/middlewares/multer.middlewares.js", () => ({
  upload: {
    fields: jest.fn(() => (req, res, next) => next()),
  },
}));

// Mock validators
jest.mock("../src/validators/common/mongodb.validators.js", () => ({
  mongoIdPathVariableValidator: jest.fn(() => (req, res, next) => next()),
}));

jest.mock("../src/validators/chat-app/message.validators.js", () => ({
  sendMessageValidator: jest.fn(() => (req, res, next) => next()),
}));

jest.mock("../src/validators/validate.js", () => ({
  validate: jest.fn((req, res, next) => next()),
}));

// Mock access middlewares
jest.mock("../src/middlewares/auth/ChaeckChatUse.js", () => ({
  checkChatAccess: jest.fn((req, res, next) => next()),
}));

jest.mock("../src/middlewares/auth/checkChatStatus.js", () => ({
  checkChatStatus: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock("../src/controllers/chat-app/message.controllers.js", () => ({
  getAllMessages: jest.fn((req, res) => res.status(200).json({ route: "getAllMessages" })),
  sendMessage: jest.fn((req, res) => res.status(201).json({ route: "sendMessage" })),
  deleteMessage: jest.fn((req, res) => res.status(200).json({ route: "deleteMessage" })),
}));

// Setup test express app
const app = express();
app.use(express.json());
app.use("/messages", messageRoutes);

describe("Message Routes", () => {

  test("GET /messages/:chatId → getAllMessages", async () => {
    const res = await request(app).get("/messages/507f1f77bcf86cd799439011");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getAllMessages");
  });

  test("POST /messages/:chatId → sendMessage", async () => {
    const res = await request(app)
      .post("/messages/507f1f77bcf86cd799439011")
      .send({ content: "Hello!" });

    expect(res.status).toBe(201);
    expect(res.body.route).toBe("sendMessage");
  });

  test("DELETE /messages/:chatId/:messageId → deleteMessage", async () => {
    const res = await request(app)
      .delete("/messages/507f1f77bcf86cd799439011/507f1f77bcf86cd799439022");

    expect(res.status).toBe(200);
    expect(res.body.route).toBe("deleteMessage");
  });

});
