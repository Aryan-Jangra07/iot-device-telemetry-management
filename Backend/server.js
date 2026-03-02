// ===== Imports =====
const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const Device = require("./models/device");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// ===== Swagger Load =====
const swaggerPath = path.join(__dirname, "docs", "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

// ===== App Init =====
const app = express();

app.use(express.json());

// ===== Swagger Route =====
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ===== MongoDB Connect =====
connectDB();

// ===== Test Route =====
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ===== POST API (Save Device) =====
app.post("/api/device", async (req, res) => {
  try {
    const { deviceId, temperature, status } = req.body;

    const device = new Device({
      deviceId,
      temperature,
      status,
    });

    await device.save();

    res.status(201).json({
      message: "Device data saved successfully ✅",
      data: device,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ===== GET API (Fetch Devices) =====
app.get("/api/device", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ===== Server Start =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});