import { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import AdminPage from './pages/AdminPage';
import { auth } from './api';

export default function App() {
  const [user, setUser] = useState(auth.user());
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand">
          📅 Queue Booking
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/bookings">จองคิว</Link>
              {user.role === 'admin' && <Link to="/admin">แอดมิน</Link>}
              <span className="hint nav-hint">สวัสดี, {user.name}</span>
              <button className="btn-link" onClick={handleLogout}>
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link to="/register">สมัครสมาชิก</Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? '/bookings' : '/login'} />}
          />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/bookings"
            element={user ? <BookingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </>
  );
}
