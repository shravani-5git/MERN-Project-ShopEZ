import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="page-section container">
        <div className="empty-state">
          <div className="empty-icon">🛍</div>
          <h3>Your bag is waiting.</h3>
          <p className="muted">Add something from the collection and it will appear here.</p>
          <Link to="/" className="btn btn-brand mt-2">Explore products</Link>
        </div>
      </main>
    );
  }

  const checkout = () => user ? navigate('/checkout') : navigate('/login');

  return (
    <main className="page-section">
      <div className="container">
        <div className="mb-4">
          <h1 className="section-title mb-1">Your bag</h1>
          <p className="muted mb-0">{items.reduce((s, i) => s + i.quantity, 0)} item(s) selected</p>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-2">
              {items.map((item) => {
                const effective = item.price - (item.price * item.discountPercent) / 100;
                return (
                  <div className="cart-row d-flex gap-3 align-items-center" key={item.productId}>
                    <img className="thumb" src={item.imageUrl || 'https://picsum.photos/seed/placeholder/100/100'} alt={item.name} />
                    <div className="flex-grow-1">
                      <div className="fw-bold">{item.name}</div>
                      <div className="muted small">${effective.toFixed(2)} each</div>
                    </div>
                    <div className="d-flex align-items-center border rounded-3 bg-white">
                      <button className="btn btn-sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span className="px-2 small fw-bold">{item.quantity}</span>
                      <button className="btn btn-sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="text-end" style={{minWidth:'88px'}}>
                      <div className="fw-bold">${(effective * item.quantity).toFixed(2)}</div>
                      <button className="btn btn-link btn-sm text-danger p-0" onClick={() => removeFromCart(item.productId)}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-4">
            <aside className="summary-card">
              <div className="product-category mb-2">Order summary</div>
              <div className="d-flex justify-content-between mb-2"><span className="muted">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between mb-3"><span className="muted">Shipping</span><span className="fw-semibold">Calculated at checkout</span></div>
              <div className="divider my-3" />
              <div className="d-flex justify-content-between fs-5 mb-4"><strong>Estimated total</strong><strong>${subtotal.toFixed(2)}</strong></div>
              <button className="btn btn-brand w-100" onClick={checkout}>Continue to checkout</button>
              {!user && <div className="small muted mt-2 text-center">You’ll be asked to sign in before checkout.</div>}
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
