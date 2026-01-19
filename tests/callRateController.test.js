/**
 * callRateController.test.js
 */

import {
  createCallRate,
  updateCallRate,
  getAllCallRates,
  getCallRateByCategory
} from "../../../path/to/your/controller.js";

import CallRatePerMin from "../../../models/Wallet/RatePerMin.js";

// Mock Model
jest.mock("../../../models/Wallet/RatePerMin.js", () => ({
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  find: jest.fn()
}));

// Response mock helper
const resMock = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  return res;
};

describe("🔹 createCallRate()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ Missing required fields", async () => {
    const req = { body: {} };
    const res = resMock();

    await createCallRate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ Rate already exists", async () => {
    const req = {
      body: {
        userCategory: "premium",
        userType: "listener",
        ratePerMinute: 10,
        adminCommissionPercent: 20
      }
    };
    const res = resMock();

    CallRatePerMin.findOne.mockResolvedValue({});

    await createCallRate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("🟢 Successfully creates rate", async () => {
    const req = {
      body: {
        userCategory: "premium",
        userType: "listener",
        ratePerMinute: 10,
        adminCommissionPercent: 20
      }
    };
    const res = resMock();

    CallRatePerMin.findOne.mockResolvedValue(null);

    const mockSave = jest.fn();
    jest.spyOn(CallRatePerMin.prototype, "save").mockImplementation(mockSave);

    await createCallRate(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

describe("🔸 updateCallRate()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ Missing required fields", async () => {
    const req = { body: { userCategory: "premium" } };
    const res = resMock();

    await updateCallRate(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ Call rate not found", async () => {
    const req = {
      body: {
        userCategory: "premium",
        userType: "listener",
        ratePerMinute: 20,
        adminCommissionPercent: 15
      }
    };
    const res = resMock();

    CallRatePerMin.findOneAndUpdate.mockResolvedValue(null);

    await updateCallRate(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 Successfully updates rate", async () => {
    const req = {
      body: {
        userCategory: "premium",
        userType: "listener",
        ratePerMinute: 20,
        adminCommissionPercent: 15
      }
    };
    const res = resMock();

    CallRatePerMin.findOneAndUpdate.mockResolvedValue({
      userCategory: "premium",
      ratePerMinute: 20
    });

    await updateCallRate(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe("🔹 getAllCallRates()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("🟢 Returns list", async () => {
    const req = {};
    const res = resMock();

    CallRatePerMin.find.mockResolvedValue([{ ratePerMinute: 10 }]);

    await getAllCallRates(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: expect.any(Array)
    }));
  });
});

describe("🔸 getCallRateByCategory()", () => {
  beforeEach(() => jest.clearAllMocks());

  test("❌ Missing category", async () => {
    const req = { query: {} };
    const res = resMock();

    await getCallRateByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("❌ Not found", async () => {
    const req = { query: { userCategory: "premium", userType: "listener" } };
    const res = resMock();

    CallRatePerMin.findOne.mockResolvedValue(null);

    await getCallRateByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("🟢 Found call rate", async () => {
    const req = { query: { userCategory: "premium", userType: "listener" } };
    const res = resMock();

    CallRatePerMin.findOne.mockResolvedValue({ ratePerMinute: 10 });

    await getCallRateByCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
