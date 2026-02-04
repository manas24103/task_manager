const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const { MONGODB_URI } = require('../src/config/env');

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the first user and make them an admin
    const user = await User.findOne();
    
    if (!user) {
      console.log('No users found. Please register a user first.');
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User "${user.username}" is already an admin.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`✅ User "${user.username}" (${user.email}) is now an admin!`);
    console.log('🔑 Admin credentials:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Role: ${user.role}`);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();
