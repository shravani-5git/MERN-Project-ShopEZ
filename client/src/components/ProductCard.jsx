import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercent > 0;
  const finalPrice = product.price - (product.price * product.discountPercent) / 100;

  return (
    <div className="col-6 col-md-4 col-xl-3 mb-4">
      <article className="product-card-new">
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <div className="product-image-wrap">
            {hasDiscount && <span className="product-tag">SAVE {product.discountPercent}%</span>}
            <img
              src={product.imageUrl || '/product-placeholder.svg'}
              alt={product.name}
              loading="lazy"
            />
          </div>
        </Link>
        <div className="product-body d-flex flex-column">
          <div className="product-category">{product.category}</div>
          <Link to={`/products/${product._id}`} className="text-decoration-none">
            <div className="product-name">{product.name}</div>
          </Link>
          <div className="mb-3"><StarRating rating={product.avgRating} numReviews={product.numReviews} /></div>
          <div className="mb-3">
            {hasDiscount && <span className="price-original">${product.price.toFixed(2)}</span>}
            <span className="price-final">${finalPrice.toFixed(2)}</span>
          </div>
          <Link to={`/products/${product._id}`} className="btn btn-dark-soft btn-sm mt-auto w-100">
            Explore item
          </Link>
        </div>
      </article>
    </div>
  );
}
