import request from "supertest";
import express from "express";

// Import the router under test
import chatRoutes from "../src/routes/chat-app/chat.routes.js";

// Mock all middlewares
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => next()),
}));

jest.mock("../src/middlewares/auth/ChaeckChatUse.js", () => ({
  checkChatAccess: jest.fn((req, res, next) => next()),
}));

jest.mock("../src/middlewares/auth/checkChatStatus.js", () => ({
  checkChatStatus: jest.fn((req, res, next) => next()),
}));

// Mock validators
jest.mock("../src/validators/common/mongodb.validators.js", () => ({
  mongoIdPathVariableValidator: jest.fn(() => (req, res, next) => next()),
}));

jest.mock("../src/validators/validate.js", () => ({
  validate: jest.fn((req, res, next) => next()),
}));

// Mock controllers
jest.mock("../src/controllers/chat-app/chat.controllers.js", () => ({
  getAllChats: jest.fn((req, res) => res.status(200).json({ route: "getAllChats" })),
  createOrGetAOneOnOneChat: jest.fn((req, res) => res.status(201).json({ route: "createOrGetAOneOnOneChat" })),
  deleteOneOnOneChat: jest.fn((req, res) => res.status(200).json({ route: "deleteOneOnOneChat" })),
  searchAvailableUsers: jest.fn((req, res) => res.status(200).json({ route: "searchAvailableUsers" })),
  markMessageAsRead: jest.fn((req, res) => res.status(200).json({ route: "markMessageAsRead" })),
  getUnreadMessagesCount: jest.fn((req, res) => res.status(200).json({ route: "getUnreadMessagesCount" })),
}));

jest.mock("../src/controllers/chat-app/getAllAgentController.js", () => ({
  getAllAgents: jest.fn((req, res) => res.status(200).json({ route: "getAllAgents" })),
}));

// Create test app
const app = express();
app.use(express.json());
app.use("/chat", chatRoutes);

describe("Chat Routes", () => {
  test("GET /chat should call getAllChats", async () => {
    const res = await request(app).get("/chat");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getAllChats");
  });

  test("GET /chat/agents should call getAllAgents", async () => {
    const res = await request(app).get("/chat/agents");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getAllAgents");
  });

  test("GET /chat/users should call searchAvailableUsers", async () => {
    const res = await request(app).get("/chat/users");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("searchAvailableUsers");
  });

  test("POST /chat/c/:receiverId should call createOrGetAOneOnOneChat", async () => {
    const res = await request(app).post("/chat/c/507f1f77bcf86cd799439011");
    expect(res.status).toBe(201);
    expect(res.body.route).toBe("createOrGetAOneOnOneChat");
  });

  test("DELETE /chat/remove/:chatId should call deleteOneOnOneChat", async () => {
    const res = await request(app).delete("/chat/remove/507f1f77bcf86cd799439011");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("deleteOneOnOneChat");
  });

  test("PUT /chat/messageread/:messageId/read should call markMessageAsRead", async () => {
    const res = await request(app).put("/chat/messageread/507f1f77bcf86cd799439011/read");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("markMessageAsRead");
  });

  test("GET /chat/messages/unread/count should call getUnreadMessagesCount", async () => {
    const res = await request(app).get("/chat/messages/unread/count");
    expect(res.status).toBe(200);
    expect(res.body.route).toBe("getUnreadMessagesCount");
  });
});
