export default function StarRating({ rating = 0, numReviews }) {
  const rounded = Math.round(rating);
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className="star">{n <= rounded ? '★' : '☆'}</span>
      ))}
      {typeof numReviews === 'number' && <span className="rating-count">({numReviews})</span>}
    </span>
  );
}
