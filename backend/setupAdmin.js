// File: backend/setupAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Make sure the path to your Admin model is correct

const adminEmail = 'admin@gmail.com';
const adminPassword = 'admin';

const setup = async () => {
    try {
        // 1. Connect to the database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected for setup...');

        // 2. Check if the admin user already exists
        let admin = await Admin.findOne({ email: adminEmail });

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        console.log(`Generated hash for password "${adminPassword}"`);

        if (admin) {
            // 4a. If user exists, update their password
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin user already existed. Password has been updated.');
        } else {
            // 4b. If user does not exist, create a new one
            admin = new Admin({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('New admin user has been created.');
        }

        console.log('✅ Admin setup complete.');

    } catch (error) {
        console.error('Error during admin setup:', error.message);
    } finally {
        // 5. Disconnect from the database
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

setup();