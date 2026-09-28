import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/myorders').then((res) => setOrders(res.data)).catch(() => setOrders([]));
  }, []);

  const statusClass = (status) => `status-badge status-${status}`;

  return (
    <main className="page-section">
      <div className="container">
        <div className="mb-4">
          <div className="product-category mb-2">Account</div>
          <h1 className="section-title mb-1">Order history</h1>
          <p className="muted">A record of everything you have purchased.</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⌁</div><h5>No orders yet</h5><p className="muted mb-0">Your completed orders will show up here.</p></div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => (
              <article key={order._id} className="surface-card p-4">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                  <div>
                    <div className="fw-bold">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="muted small mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <span className={statusClass(order.status)}>{order.status}</span>
                </div>
                <div className="divider my-3" />
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex justify-content-between py-1">
                    <span>{item.name} <span className="muted">× {item.quantity}</span></span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-end mt-3 fw-bold">Total · ${order.total.toFixed(2)}</div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
