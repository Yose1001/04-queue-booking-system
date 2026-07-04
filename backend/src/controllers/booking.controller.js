const Booking = require('../models/Booking');

// ระยะเวลา (นาที) ของแต่ละบริการ — ผู้ใช้เลือกแค่เวลาเริ่ม ระบบคำนวณเวลาสิ้นสุดเอง
const SERVICE_DURATIONS = {
  'ตัดผม': 30,
  'ทำสีผม': 90,
  'สระไดร์': 30,
};

// POST /api/bookings — สร้างการจองใหม่ (เช็คคิวซ้อนก่อนบันทึก)
exports.createBooking = async (req, res) => {
  try {
    const { serviceName, startTime, note } = req.body;
    if (!serviceName || !startTime) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const duration = SERVICE_DURATIONS[serviceName];
    if (!duration) {
      return res.status(400).json({ message: 'ไม่พบบริการนี้ในระบบ' });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: 'รูปแบบเวลาไม่ถูกต้อง' });
    }

    // รับเฉพาะเวลาที่ลงตัวทุก 10 นาที (เช่น 10:00, 10:10, 10:20)
    if (start.getMinutes() % 10 !== 0 || start.getSeconds() !== 0) {
      return res.status(400).json({ message: 'เลือกเวลาได้เฉพาะทุก ๆ 10 นาทีเท่านั้น' });
    }

    const end = new Date(start.getTime() + duration * 60 * 1000);

    // Business logic สำคัญ: ห้ามจองเวลาซ้อนกับคิวที่ยังไม่ถูกยกเลิก
    const overlapping = await Booking.findOne({
      serviceName,
      status: { $ne: 'cancelled' },
      startTime: { $lt: end },
      endTime: { $gt: start },
    });
    if (overlapping) {
      return res.status(409).json({ message: 'ช่วงเวลานี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      serviceName,
      startTime: start,
      endTime: end,
      note,
    });

    res.status(201).json({ message: 'จองคิวสำเร็จ', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/me — ดูการจองของตัวเอง
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ startTime: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings — (admin) ดูการจองทั้งหมด
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .sort({ startTime: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/bookings/:id/cancel — ยกเลิกการจองของตัวเอง
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'ไม่พบการจองนี้' });
    }

    const isOwner = booking.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ยกเลิกการจองนี้' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'ยกเลิกการจองแล้ว', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
