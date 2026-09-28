import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUSES = ['placed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => api.get('/admin/orders').then((res) => setOrders(res.data));

  useEffect(() => { loadOrders(); }, []);

  async function handleStatusChange(orderId, status) {
    await api.put(`/admin/orders/${orderId}/status`, { status });
    loadOrders();
  }

  return (
    <main className="page-section">
      <div className="container">
        <div className="mb-4"><div className="product-category mb-2">Admin</div><h1 className="section-title">Orders</h1><p className="muted">Review customers and update fulfillment status.</p></div>
        {orders.length === 0 ? <div className="empty-state">No orders have been placed yet.</div> : (
          <div className="data-card">
            <table className="table">
              <thead><tr><th>Reference</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="small fw-semibold">#{order._id.slice(-8).toUpperCase()}</td>
                    <td><div className="fw-semibold">{order.user?.name}</div><div className="muted small">{order.user?.email}</div></td>
                    <td>{order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</td>
                    <td className="fw-semibold">${order.total.toFixed(2)}</td>
                    <td><select className="form-select form-select-sm" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
