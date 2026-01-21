import request from "supertest";
import express from "express";
import router from "../src/routes/Survey/SurveyRoute"; // <-- update path if needed

// -------------------
// MOCK MIDDLEWARE
// -------------------
jest.mock("../src/middlewares/auth/authMiddleware.js", () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: "mockUser123", email: "mock@example.com" };
    next();
  }),
}));

// -------------------
// MOCK CONTROLLERS
// -------------------
jest.mock("../src/controllers/Survey/Survey.Controller.js", () => ({
  createSurvey: jest.fn((req, res) =>
    res.status(201).json({ message: "Survey created" })
  ),
  getSurveys: jest.fn((req, res) =>
    res.status(200).json({ surveys: [] })
  ),
  getSurveyById: jest.fn((req, res) =>
    res.status(200).json({ survey: { id: req.params.id } })
  ),
  getSurveyStats: jest.fn((req, res) =>
    res.status(200).json({ stats: { total: 10 } })
  ),
  getSurveysbyEmail: jest.fn((req, res) =>
    res.status(200).json({ surveys: [], email: req.user.email })
  ),
}));

// Express app instance
const app = express();
app.use(express.json());
app.use("/survey", router); // mount router for testing

describe("Survey Routes API", () => {

  // CREATE SURVEY
  test("POST /survey → should create a survey", async () => {
    const res = await request(app)
      .post("/survey")
      .send({ title: "Test Survey" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Survey created");
  });

  // GET ALL SURVEYS
  test("GET /survey → should return surveys", async () => {
    const res = await request(app).get("/survey");
    
    expect(res.status).toBe(200);
    expect(res.body.surveys).toEqual([]);
  });

  // GET SURVEY BY ID
  test("GET /survey/:id → should return survey by id", async () => {
    const res = await request(app).get("/survey/12345");
    
    expect(res.status).toBe(200);
    expect(res.body.survey).toEqual({ id: "12345" });
  });

  // GET SURVEY STATS
  test("GET /survey/stats → should return survey stats", async () => {
    const res = await request(app).get("/survey/stats");
    
    expect(res.status).toBe(200);
    expect(res.body.stats).toEqual({ total: 10 });
  });

  // GET SURVEYS BY EMAIL (PROTECTED)
  test("POST /survey/getSurveysbyEmail → should return surveys by email", async () => {
    const res = await request(app)
      .post("/survey/getSurveysbyEmail")
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("mock@example.com");
    expect(res.body.surveys).toEqual([]);
  });

});
