import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('We could not find that order.'));
  }, [id]);

  if (error) return <main className="page-section container"><div className="alert alert-danger border-0 rounded-4">{error}</div></main>;
  if (!order) return <main className="page-section container"><p className="muted">Loading order...</p></main>;

  return (
    <main className="page-section">
      <div className="container" style={{maxWidth:'720px'}}>
        <div className="text-center mb-4">
          <div className="auth-badge mx-auto mb-3">✓</div>
          <h1 className="section-title">Order placed.</h1>
          <p className="muted">Thanks for shopping with ShopEZ. Your order is now recorded.</p>
          <div className="small muted">Reference #{order._id.slice(-10).toUpperCase()}</div>
        </div>

        <div className="surface-card p-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between py-2">
              <span>{item.name} <span className="muted">× {item.quantity}</span></span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="divider my-3" />
          <div className="d-flex justify-content-between"><span className="muted">Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
          {order.discountAmount > 0 && <div className="d-flex justify-content-between text-success mt-2"><span>Discount ({order.couponCode})</span><span>-${order.discountAmount.toFixed(2)}</span></div>}
          <div className="d-flex justify-content-between fs-5 mt-3"><strong>Total</strong><strong>${order.total.toFixed(2)}</strong></div>
        </div>

        <div className="text-center mt-4">
          <Link to="/my-orders" className="btn btn-outline-clean me-2">View orders</Link>
          <Link to="/" className="btn btn-brand">Keep shopping</Link>
        </div>
      </div>
    </main>
  );
}
