const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

console.log("Connecting Influx...");
console.log("URL:", url);
console.log("ORG:", org);
console.log("BUCKET:", bucket);

const influxDB = new InfluxDB({ url, token });
const writeApi = influxDB.getWriteApi(org, bucket);

writeApi.useDefaultTags({ app: "iot-project" });

const writeTemperature = async (deviceId, temperature, status) => {
  try {
    const point = new Point("device_data")
      .tag("deviceId", deviceId)
      .floatField("temperature", Number(temperature))
      .stringField("status", status);

    writeApi.writePoint(point);

    // IMPORTANT FIX
    await writeApi.flush();

    console.log("InfluxDB WRITE SUCCESS ✅");
  } catch (err) {
    console.error("Influx WRITE ERROR ❌", err);
  }
};

module.exports = writeTemperature;