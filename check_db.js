const mongoose = require('mongoose');
const Device = require('./Backend/models/device');
require('dotenv').config({ path: './Backend/.env' });

async function checkDevices() {
    await mongoose.connect(process.env.MONGO_URI);
    const devices = await Device.find({});
    console.log(`Total devices: ${devices.length}`);
    devices.forEach(d => {
        console.log(`- ID: ${d.deviceId}, Name: ${d.name}, Owner: ${d.owner}`);
    });
    await mongoose.disconnect();
}

checkDevices().catch(console.error);
