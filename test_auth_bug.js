const mongoose = require('mongoose');
const User = require('./Backend/models/User');
require('dotenv').config({ path: './Backend/.env' });

async function testAuth() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_iot');
    console.log("Connected to DB");

    const email = "test_auth_bug@example.com";
    const password = "correct_password";

    // 1. Cleanup
    await User.deleteMany({ email });

    // 2. Register
    console.log("Registering user...");
    const user = await User.create({ email, password });
    console.log("User created with password hash length:", user.password.length);

    // 3. Test correct login
    const userInDb = await User.findOne({ email });
    const correctRes = await userInDb.comparePassword(password);
    console.log("Login with CORRECT password:", correctRes);

    // 4. Test WRONG login
    const wrongRes = await userInDb.comparePassword("wrong_password");
    console.log("Login with WRONG password:", wrongRes);

    if (wrongRes === true) {
        console.error("❌ BUG DETECTED: Wrong password accepted!");
    } else {
        console.log("✅ Auth seems to work fine in isolation.");
    }

    await mongoose.disconnect();
}

testAuth().catch(console.error);
