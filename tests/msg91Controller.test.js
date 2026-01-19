/**
 * @jest-environment node
 */
import { sendOtp, retryOtp, verifyOtp, updateOtpTemplate, getAnalyticsReport } from "../src/controllers/OTP/msg91Controller.js";
import https from "https";

jest.mock("https");

const mockJsonReq = (method, url, body = null, query = {}) => {
  let req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  req.method = method;
  req.body = body;
  req.query = query;

  return { req, res };
};

describe("MSG91 Controller Tests", () => {
  beforeEach(() => {
    https.request.mockReset();
  });

  test("sendOtp should return success response", done => {
    const mockResponseBody = JSON.stringify({ type: "success", message: "OTP sent" });

    // Mock https.request response flow
    const mockResponse = {
      on: jest.fn((event, cb) => {
        if (event === "data") cb(Buffer.from(mockResponseBody));
        if (event === "end") cb();
      }),
      statusCode: 200
    };

    const mockReq = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn()
    };

    https.request.mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockReq;
    });

    const { req, res } = mockJsonReq("POST", "", { mobile: "9876543210" });

    sendOtp(req, {
      status: code => ({
        json: data => {
          try {
            expect(code).toBe(200);
            expect(data.type).toBe("success");
            expect(data.message).toBe("OTP sent");
            done();
          } catch (err) {
            done(err);
          }
        }
      })
    });
  });

  test("retryOtp should return success response", done => {
    const mockResponseBody = JSON.stringify({ type: "success", message: "Retry sent" });

    const mockResponse = {
      on: jest.fn((event, cb) => {
        if (event === "data") cb(Buffer.from(mockResponseBody));
        if (event === "end") cb();
      }),
      statusCode: 200
    };

    https.request.mockImplementation((options, callback) => {
      callback(mockResponse);
      return { on: jest.fn(), end: jest.fn() };
    });

    const { req, res } = mockJsonReq("GET", "", null, { mobile: "9876543210" });

    retryOtp(req, {
      status: code => ({
        json: data => {
          try {
            expect(code).toBe(200);
            expect(data.type).toBe("success");
            expect(data.message).toBe("Retry sent");
            done();
          } catch (err) {
            done(err);
          }
        }
      })
    });
  });

  test("verifyOtp should return success response", done => {
    const mockResponseBody = JSON.stringify({ type: "success", message: "OTP verified" });

    const mockResponse = {
      on: jest.fn((event, cb) => {
        if (event === "data") cb(Buffer.from(mockResponseBody));
        if (event === "end") cb();
      }),
      statusCode: 200
    };

    https.request.mockImplementation((options, callback) => {
      callback(mockResponse);
      return { on: jest.fn(), end: jest.fn() };
    });

    const { req, res } = mockJsonReq("GET", "", null, { otp: "1234", mobile: "9876543210" });

    verifyOtp(req, {
      status: code => ({
        json: data => {
          try {
            expect(code).toBe(200);
            expect(data.type).toBe("success");
            expect(data.message).toBe("OTP verified");
            done();
          } catch (err) {
            done(err);
          }
        }
      })
    });
  });

  test("updateOtpTemplate should return success response", done => {
    const mockResponseBody = JSON.stringify({ type: "success", message: "Template updated" });

    const mockResponse = {
      on: jest.fn((event, cb) => {
        if (event === "data") cb(Buffer.from(mockResponseBody));
        if (event === "end") cb();
      }),
      statusCode: 200
    };

    const mockReqHttp = { on: jest.fn(), write: jest.fn(), end: jest.fn() };

    https.request.mockImplementation((options, callback) => {
      callback(mockResponse);
      return mockReqHttp;
    });

    const { req, res } = mockJsonReq("POST", "", {
      templateId: "111",
      template: "New Template",
      dltTemplateId: "DLT123",
      senderId: "ABC"
    });

    updateOtpTemplate(req, {
      status: code => ({
        json: data => {
          try {
            expect(code).toBe(200);
            expect(data.type).toBe("success");
            expect(data.message).toBe("Template updated");
            expect(mockReqHttp.write).toHaveBeenCalled();
            done();
          } catch (err) {
            done(err);
          }
        }
      })
    });
  });

  test("getAnalyticsReport should return success response", done => {
    const mockResponseBody = JSON.stringify({ type: "success", analytics: [] });

    const mockResponse = {
      on: jest.fn((event, cb) => {
        if (event === "data") cb(Buffer.from(mockResponseBody));
        if (event === "end") cb();
      }),
      statusCode: 200
    };

    https.request.mockImplementation((options, callback) => {
      callback(mockResponse);
      return { on: jest.fn(), end: jest.fn() };
    });

    const { req, res } = mockJsonReq("GET", "", null, {
      startDate: "2024-01-10",
      endDate: "2024-01-12"
    });

    getAnalyticsReport(req, {
      status: code => ({
        json: data => {
          try {
            expect(code).toBe(200);
            expect(data.type).toBe("success");
            expect(Array.isArray(data.analytics)).toBe(true);
            done();
          } catch (err) {
            done(err);
          }
        }
      })
    });
  });
});
