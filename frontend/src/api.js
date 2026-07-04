// ตัวกลางเรียก API ทั้งหมด — แนบ JWT token ให้อัตโนมัติถ้ามี
const BASE_URL = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
  }
  return data;
}

export const api = {
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  createBooking: (body) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  getMyBookings: () => request('/bookings/me'),
  getAllBookings: () => request('/bookings'),
  cancelBooking: (id) => request(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};

// จัดการ session ของผู้ใช้ใน localStorage
export const auth = {
  save({ token, user }) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  user() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
