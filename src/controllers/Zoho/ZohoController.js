import { getAuthorizationCode, handleCallback } from "../../servises/ZohoServices.js";

const generateAuthCode = (req, res) => {
  try {
    const authUrl = getAuthorizationCode();
    return res.status(200).json({ success: true, authUrl });
  } catch (error) {
    console.error("Zoho Auth Code Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate auth code" });
  }
};

const processCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, message: "Authorization code is required" });
    }

    const tokens = await handleCallback(code);

    return res.status(200).json({
      success: true,
      message: "Authorization successful",
      tokens,
    });

  } catch (error) {
    console.error("Zoho Callback Error:", error);
    return res.status(500).json({ success: false, message: "Failed to process callback" });
  }
};

export { generateAuthCode, processCallback };
