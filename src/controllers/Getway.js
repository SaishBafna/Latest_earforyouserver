import PaymentGateway from "../models/PaymentGetway.js";

// Get the current active payment gateway
export const getPaymentGateway = async (req, res) => {
  try {
    const gateway = await PaymentGateway.findOne();
    if (!gateway) {
      return res.status(404).json({ success: false, message: "No payment gateway found" });
    }
    return res.status(200).json({ success: true, data: gateway });
  } catch (error) {
    console.error("Get Gateway Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching gateway" });
  }
};

// Create or update the payment gateway (only one allowed)
export const createOrUpdateGateway = async (req, res) => {
  try {
    const { gatewayType, isActive } = req.body;

    if (!gatewayType) {
      return res.status(400).json({ success: false, message: "gatewayType is required" });
    }

    let gateway = await PaymentGateway.findOne();

    if (!gateway) {
      // Create
      gateway = await PaymentGateway.create({
        gatewayType,
        isActive: typeof isActive === "boolean" ? isActive : true,
      });
      return res.status(201).json({ success: true, message: "Gateway created", data: gateway });
    }

    // Update
    gateway.gatewayType = gatewayType;
    if (typeof isActive === "boolean") gateway.isActive = isActive;
    
    await gateway.save();
    return res.status(200).json({ success: true, message: "Gateway updated", data: gateway });

  } catch (error) {
    console.error("Create/Update Gateway Error:", error);
    return res.status(500).json({ success: false, message: "Error creating/updating gateway" });
  }
};
