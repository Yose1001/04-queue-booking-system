import { useEffect, useState } from 'react';
import { api } from '../api';

// บริการและระยะเวลา (นาที) — ต้องตรงกับ SERVICE_DURATIONS ฝั่ง backend
const SERVICES = [
  { name: 'ตัดผม', duration: 30 },
  { name: 'ทำสีผม', duration: 90 },
  { name: 'สระไดร์', duration: 30 },
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];

const STATUS_LABEL = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  cancelled: 'ยกเลิกแล้ว',
};

function formatDateTime(value) {
  return new Date(value).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    serviceName: '',
    date: today(),
    hour: '10',
    minute: '00',
    note: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedService = SERVICES.find((s) => s.name === form.serviceName);

  const loadBookings = async () => {
    try {
      setBookings(await api.getMyBookings());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const startTime = `${form.date}T${form.hour}:${form.minute}:00`;
      await api.createBooking({
        serviceName: form.serviceName,
        startTime,
        note: form.note,
      });
      setMessage('จองคิวสำเร็จ!');
      setForm({ ...form, note: '' });
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('ต้องการยกเลิกการจองนี้ใช่ไหม?')) return;
    try {
      await api.cancelBooking(id);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>✂️ จองคิวใหม่</h2>
        <form onSubmit={handleSubmit}>
          <label>
            บริการ
            <select
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              required
            >
              <option value="">-- เลือกบริการ --</option>
              {SERVICES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.duration} นาที)
                </option>
              ))}
            </select>
          </label>

          <div className="row">
            <label>
              วันที่
              <input
                type="date"
                name="date"
                value={form.date}
                min={today()}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              เวลาเริ่ม
              <div className="time-picker">
                <select name="hour" value={form.hour} onChange={handleChange}>
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="time-sep">:</span>
                <select
                  name="minute"
                  value={form.minute}
                  onChange={handleChange}
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {selectedService && (
            <p className="duration-info">
              ⏱ ใช้เวลาประมาณ {selectedService.duration} นาที — เสร็จเวลา{' '}
              {(() => {
                const start = new Date(
                  `${form.date}T${form.hour}:${form.minute}:00`
                );
                const end = new Date(
                  start.getTime() + selectedService.duration * 60000
                );
                return end.toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                });
              })()}{' '}
              น. โดยประมาณ
            </p>
          )}

          <label>
            หมายเหตุ (ถ้ามี)
            <input name="note" value={form.note} onChange={handleChange} />
          </label>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'กำลังจอง...' : 'จองคิว'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>🗓 คิวของฉัน ({bookings.length})</h2>
        {bookings.length === 0 ? (
          <p className="hint">ยังไม่มีการจอง</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>บริการ</th>
                  <th>เริ่ม</th>
                  <th>สิ้นสุด</th>
                  <th>สถานะ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.serviceName}</td>
                    <td>{formatDateTime(b.startTime)}</td>
                    <td>{formatDateTime(b.endTime)}</td>
                    <td>
                      <span className={`badge ${b.status}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </td>
                    <td>
                      {b.status !== 'cancelled' && (
                        <button
                          className="btn-cancel"
                          onClick={() => handleCancel(b._id)}
                        >
                          ยกเลิก
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
