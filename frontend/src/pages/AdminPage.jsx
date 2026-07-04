import { useEffect, useState } from 'react';
import { api } from '../api';

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

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getAllBookings()
      .then(setBookings)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h2>การจองทั้งหมด ({bookings.length})</h2>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>ผู้จอง</th>
              <th>บริการ</th>
              <th>เริ่ม</th>
              <th>สิ้นสุด</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>
                  {b.user?.name}
                  <div className="hint">{b.user?.email}</div>
                </td>
                <td>{b.serviceName}</td>
                <td>{formatDateTime(b.startTime)}</td>
                <td>{formatDateTime(b.endTime)}</td>
                <td>
                  <span className={`badge ${b.status}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
