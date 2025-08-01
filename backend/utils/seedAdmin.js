require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function createAdmin() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Vérifie s’il existe déjà un admin
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("✅ Admin user already exists.");
            await mongoose.disconnect();
            return process.exit();
        }

        // Créer l'utilisateur admin
        const adminUser = new User({
            name: process.env.ADMIN_NAME || "Admin",
            email: process.env.ADMIN_EMAIL || "admin@test.com",
            password: process.env.ADMIN_PASSWORD || "123456",
            role: "admin",
        });

        // console.log("Creating admin user:", adminUser);

        await adminUser.save();
        console.log("✅ Admin user created successfully.");
        await mongoose.disconnect();
        process.exit();
    } catch (err) {
        console.error("❌ Error creating admin user:", err);
        process.exit(1);
    }
}

createAdmin();