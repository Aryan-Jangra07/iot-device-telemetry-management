// ================= IMPORTS =================
const express = require("express");
require("dotenv").config();
const path = require("path");

const connectDB = require("./config/db");
const Device = require("./models/device");
const writeTemperature = require("./config/influx");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// ================= SWAGGER LOAD =================
const swaggerPath = path.join(__dirname, "docs", "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

// ================= APP INIT =================
const app = express();
app.use(express.json());

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ================= DATABASE CONNECT =================
connectDB();

console.log("ENV CHECK:");
console.log("INFLUX_URL =", process.env.INFLUX_URL);
console.log("INFLUX_ORG =", process.env.INFLUX_ORG);
console.log("INFLUX_BUCKET =", process.env.INFLUX_BUCKET);

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ✅ POST DEVICE DATA (Mongo + Influx)
app.post("/api/device", async (req, res) => {
  try {
    const { deviceId, temperature, status } = req.body;

    console.log("Incoming Data:", deviceId, temperature, status);

    // Save in MongoDB
    const newDevice = new Device({
      deviceId,
      temperature,
      status,
    });

    await newDevice.save();
    console.log("Saved in MongoDB ✅");

    // Save in InfluxDB
    writeTemperature(deviceId, temperature, status);
    console.log("Sent to InfluxDB ✅");

    res.status(201).json({
      message: "Device data saved successfully ✅",
      data: newDevice,
    });

  } catch (error) {
    console.error("POST ERROR:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


// ✅ GET ALL DEVICES
app.get("/api/device", async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});


// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});