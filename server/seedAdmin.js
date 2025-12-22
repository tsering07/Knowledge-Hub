const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/User');

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'rangiabhishek78@gmail.com' });
        
        if (existingAdmin) {
            // Update existing user to admin
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ Existing user updated to Admin role!');
            console.log('Email: rangiabhishek78@gmail.com');
            console.log('Role: admin');
        } else {
            // Create new admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Abhishek@123', salt);

            const adminUser = await User.create({
                username: 'Abhishek',
                email: 'rangiabhishek78@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });

            // Need to update password directly since the pre-save hook will hash it again
            await User.findByIdAndUpdate(adminUser._id, { password: hashedPassword });

            console.log('✅ Admin user created successfully!');
            console.log('================================');
            console.log('Email: rangiabhishek78@gmail.com');
            console.log('Password: Abhishek@123');
            console.log('Role: admin');
            console.log('================================');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
