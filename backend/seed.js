// backend/seed.js - CREATE THIS FILE
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/UserModel.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  try {
    // Delete existing admin (clean slate)
    await User.deleteOne({ email: 'admin@stringcraft.com' });
    
    // Create NEW admin with hashed password
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@stringcraft.com',
      password: 'Admin123!',  // ← Gets hashed automatically
      role: 'admin'
    });
    
    console.log('✅ Admin created!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: Admin123!');
    console.log('👑 Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();

