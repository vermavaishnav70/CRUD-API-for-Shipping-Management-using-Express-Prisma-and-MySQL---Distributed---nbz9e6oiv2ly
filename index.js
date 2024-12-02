const express = require("express");
const dotenv = require("dotenv");
const { prisma } = require("./db/config");
const verifyToken = require("./middlewares/verifySecret");
dotenv.config();

const app = express();
app.use(express.json());
app.use(verifyToken);
const validateFields = (fields) => (req, res, next) => {
  const missingFields = fields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(404).json({ error: "All fields required" });
  }
  next();
};

app.post(
  "/api/shipping/create",
  validateFields(["userId", "productId", "count"]),
  async (req, res) => {
    try {
      const { userId, productId, count } = req.body;
      const newShipping = await prisma.shipping.create({
        data: { userId, productId, count },
      });
      res.status(201).json(newShipping);
    } catch (error) {
      res.status(500).json({ error: `Internal Server Error ${error.message}` });
    }
  }
);
app.put(
  "/api/shipping/cancel",
  validateFields(["shippingId"]),
  async (req, res) => {
    try {
      const { shippingId } = req.body;
      const updatedShipping = await prisma.shipping.update({
        where: { id: shippingId },
        data: { status: "cancelled" },
      });
      res.status(200).json(updatedShipping);
    } catch (error) {
      res.status(404).json({ error: "Shipping record not found" });
    }
  }
);
app.get("/api/shipping/get", async (req, res) => {
   try {
    const { userId } = req.query;
    const shippings = await prisma.shipping.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
    });
    res.status(200).json(shippings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
