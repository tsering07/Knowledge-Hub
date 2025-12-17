const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Category.deleteMany();

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

        console.log('Categories Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
