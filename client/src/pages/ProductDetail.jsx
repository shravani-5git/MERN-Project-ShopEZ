import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadReviews() {
    try { const { data } = await api.get(`/reviews/product/${id}`); setReviews(data); } catch {}
  }

  useEffect(() => {
    setError('');
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('This product could not be found.'));
    loadReviews();
  }, [id]);

  function handleAddToCart() {
    addToCart(product, Number(quantity));
    setMessage('Added to your bag');
    setTimeout(() => setMessage(''), 2200);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    try {
      await api.post('/reviews', { productId: id, rating: Number(rating), comment });
      setComment('');
      setRating(5);
      await loadReviews();
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    }
  }

  if (error && !product) return <main className="page-section container"><div className="alert alert-danger border-0 rounded-4">{error}</div></main>;
  if (!product) return <main className="page-section container"><p className="muted">Loading item...</p></main>;

  const finalPrice = product.price - (product.price * product.discountPercent) / 100;

  return (
    <main className="page-section">
      <div className="container">
        <Link to="/" className="text-decoration-none muted small">← Back to collection</Link>

        <div className="row g-4 g-lg-5 mt-2">
          <div className="col-lg-6">
            <div className="surface-card p-2">
              <img
                src={product.imageUrl || 'https://picsum.photos/seed/placeholder/700/600'}
                alt={product.name}
                className="w-100 rounded-4"
                style={{ height: '520px', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="product-category mb-2">{product.category}</div>
            <h1 className="display-5 fw-bold mb-3" style={{letterSpacing:'-.05em'}}>{product.name}</h1>
            <div className="mb-4"><StarRating rating={product.avgRating} numReviews={product.numReviews} /></div>
            <p className="muted fs-5">{product.description}</p>

            <div className="d-flex align-items-center gap-2 mb-2 mt-4">
              {product.discountPercent > 0 && <span className="price-original fs-6">${product.price.toFixed(2)}</span>}
              <span className="price-final fs-3">${finalPrice.toFixed(2)}</span>
              {product.discountPercent > 0 && <span className="discount-pill">{product.discountPercent}% OFF</span>}
            </div>

            <p className="small muted mb-4">
              {product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}
            </p>

            {product.stock > 0 && (
              <div className="d-flex gap-2 mb-3">
                <div className="d-flex align-items-center border rounded-3 bg-white px-2">
                  <button className="btn btn-sm" onClick={() => setQuantity(Math.max(1, Number(quantity) - 1))}>−</button>
                  <span className="px-2 fw-bold">{quantity}</span>
                  <button className="btn btn-sm" onClick={() => setQuantity(Math.min(product.stock, Number(quantity) + 1))}>+</button>
                </div>
                <button className="btn btn-brand flex-grow-1" onClick={handleAddToCart}>Add to bag</button>
              </div>
            )}

            {message && <div className="alert alert-success border-0 rounded-3 py-2">{message}</div>}
            {error && product && <div className="alert alert-danger border-0 rounded-3">{error}</div>}
          </div>
        </div>

        <section className="mt-5 pt-4">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <div><h3 className="mb-1">Customer notes</h3><p className="muted mb-0">What other shoppers are saying</p></div>
          </div>

          {reviews.length === 0 ? (
            <div className="surface-card p-4 muted">No reviews yet. Be the first to share your experience.</div>
          ) : (
            <div className="row g-3">
              {reviews.map((review) => (
                <div className="col-md-6" key={review._id}>
                  <div className="surface-card p-4 h-100">
                    <div className="d-flex justify-content-between gap-3">
                      <strong>{review.userName}</strong>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-3 mb-0">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {user ? (
            <form className="surface-card p-4 mt-4" onSubmit={handleSubmitReview}>
              <h5>Leave your review</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Rating</label>
                  <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                    {[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="col-md-9">
                  <label className="form-label small fw-semibold">Comment</label>
                  <textarea className="form-control" rows="3" placeholder="Tell other shoppers what you think..." value={comment} onChange={(e) => setComment(e.target.value)} required />
                </div>
              </div>
              <button className="btn btn-dark-soft mt-3" type="submit">Publish review</button>
            </form>
          ) : (
            <div className="surface-card p-4 mt-4 muted">
              <Link to="/login" onClick={() => navigate('/login')} className="fw-bold text-decoration-none">Sign in</Link> to leave a review.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
