import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const total = subtotal - discountAmount;

  async function handleApplyCoupon() {
    setCouponError('');
    setAppliedCoupon(null);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(data);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'That coupon is not valid');
    }
  }

  async function handlePlaceOrder() {
    setPlacingOrder(true);
    setOrderError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      });
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Could not place the order');
    } finally {
      setPlacingOrder(false);
    }
  }

  if (!items.length) return <main className="page-section container"><div className="empty-state">Your bag is empty.</div></main>;

  return (
    <main className="page-section">
      <div className="container" style={{maxWidth:'920px'}}>
        <div className="mb-4">
          <div className="product-category mb-2">Final step</div>
          <h1 className="section-title">Review & place order</h1>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="surface-card p-4">
              <h5 className="mb-3">Items in your order</h5>
              {items.map((item) => {
                const effective = item.price - (item.price * item.discountPercent) / 100;
                return (
                  <div key={item.productId} className="d-flex justify-content-between gap-3 py-2">
                    <span>{item.name} <span className="muted">× {item.quantity}</span></span>
                    <strong>${(effective * item.quantity).toFixed(2)}</strong>
                  </div>
                );
              })}
              <div className="divider my-3" />
              <div className="d-flex justify-content-between"><span className="muted">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discountAmount > 0 && <div className="d-flex justify-content-between text-success mt-2"><span>Coupon savings</span><span>-${discountAmount.toFixed(2)}</span></div>}
              <div className="d-flex justify-content-between fs-5 mt-3"><strong>Total</strong><strong>${total.toFixed(2)}</strong></div>
            </div>

            <div className="surface-card p-4 mt-3">
              <h5>Discount code</h5>
              <div className="input-group mt-3">
                <input className="form-control" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                <button className="btn btn-outline-clean" type="button" onClick={handleApplyCoupon}>Apply</button>
              </div>
              {couponError && <div className="text-danger small mt-2">{couponError}</div>}
              {appliedCoupon && <div className="text-success small mt-2">{appliedCoupon.code} applied — {appliedCoupon.discountPercent}% saved.</div>}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="summary-card">
              <div className="product-category mb-2">Demo checkout</div>
              <h5>Ready to place it?</h5>
              <p className="muted small">This project uses a simulated checkout. No real payment is collected.</p>
              {orderError && <div className="alert alert-danger border-0 rounded-3 small">{orderError}</div>}
              <button className="btn btn-brand w-100 mt-2" onClick={handlePlaceOrder} disabled={placingOrder}>
                {placingOrder ? 'Processing...' : `Place order · $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
