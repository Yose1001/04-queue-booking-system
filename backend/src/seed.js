const bcrypt = require('bcryptjs');
const User = require('./models/User');

// สร้างบัญชี admin ให้อัตโนมัติถ้ายังไม่มี (สะดวกตอน demo)
module.exports = async function seedIfEmpty() {
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@queue.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    });
    console.log('Seeded admin account: admin@queue.com / admin123');
  }
};
