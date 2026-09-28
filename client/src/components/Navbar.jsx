import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-nav">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <span className="brand-mark">S</span>
            <span className="brand-word">ShopEZ</span>
          </Link>

          <div className="d-flex align-items-center gap-1 gap-md-2 flex-wrap justify-content-end">
            <Link to="/" className="nav-link-custom d-none d-sm-inline-block">Discover</Link>
            {user && <Link to="/my-orders" className="nav-link-custom d-none d-md-inline-block">Orders</Link>}
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-link-custom d-none d-md-inline-block">Control Center</Link>
            )}
            <Link to="/cart" className="nav-cart">
              <span>Bag</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {user ? (
              <>
                <span className="d-none d-lg-inline small muted ms-2">Hi, {user.name}</span>
                <button className="btn btn-outline-clean btn-sm ms-1" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-custom">Sign in</Link>
                <Link to="/register" className="btn btn-brand btn-sm">Create account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
