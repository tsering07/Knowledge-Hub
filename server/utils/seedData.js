const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');

// Seed admin user
const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: 'rangiabhishek78@gmail.com' });
        
        if (existingAdmin) {
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Existing user updated to Admin role!');
            }
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Abhishek@123', salt);

            const adminUser = await User.create({
                username: 'Abhishek',
                email: 'rangiabhishek78@gmail.com',
                password: hashedPassword,
                role: 'admin'
            });

            await User.findByIdAndUpdate(adminUser._id, { password: hashedPassword });
            console.log('✅ Admin user created (rangiabhishek78@gmail.com / Abhishek@123)');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

// Seed categories
const seedCategories = async () => {
    try {
        const existingCategories = await Category.countDocuments();
        
        if (existingCategories === 0) {
            const categories = [
                {
                    name: 'General',
                    slug: 'general',
                    description: 'General topics',
                    icon: 'Folder'
                },
                {
                    name: 'Engineering',
                    slug: 'engineering',
                    description: 'Technical documentation and guides',
                    icon: 'Cpu'
                },
                {
                    name: 'Human Resources',
                    slug: 'hr',
                    description: 'HR policies and employee handbook',
                    icon: 'Users'
                },
                {
                    name: 'Marketing',
                    slug: 'marketing',
                    description: 'Brand assets and marketing materials',
                    icon: 'Megaphone'
                }
            ];

            await Category.insertMany(categories);
            console.log('✅ Categories seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding categories:', error.message);
    }
};

// Run all seeds
const runSeeds = async () => {
    await seedAdmin();
    await seedCategories();
    
    // Import and run article seeding after categories are created
    const { seedArticles } = require('./seedArticles');
    await seedArticles();
};

module.exports = { seedAdmin, seedCategories, runSeeds };
