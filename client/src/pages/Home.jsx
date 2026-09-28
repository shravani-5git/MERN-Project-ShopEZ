import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (sort) params.sort = sort;

    api.get('/products', { params })
      .then((res) => {
        setProducts(res.data);
        setError('');
      })
      .catch(() => setError('We could not load the catalog. Please check the API connection.'))
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  const featured = useMemo(() => products.filter((p) => p.discountPercent > 0).slice(0, 4), [products]);

  return (
    <main className="page-section">
      <div className="container">
        <section className="hero-panel mb-5">
          <div className="hero-content">
            <span className="hero-kicker">Curated everyday essentials</span>
            <h1 className="hero-title">Good products.<br />Less searching.</h1>
            <p className="hero-copy">
              Browse a focused collection, compare prices, save favorites to your bag,
              and keep every order in one simple place.
            </p>
            <a href="#catalog" className="btn btn-light btn-lg mt-2 fw-bold rounded-3 px-4">
              Browse collection
            </a>
          </div>
        </section>

        <section id="catalog">
          <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-3">
            <div>
              <div className="section-title">Browse the collection</div>
              <div className="muted small">{products.length} items currently available</div>
            </div>
            {featured.length > 0 && <div className="muted small">Deals are marked on product cards</div>}
          </div>

          <div className="filter-panel mb-4">
            <div className="row g-2 align-items-center">
              <div className="col-lg-6">
                <input
                  className="form-control search-box"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-6 col-lg-3">
                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="">Newest first</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>
              <div className="col-md-6 col-lg-3">
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Every category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {categories.length > 0 && (
              <div className="d-flex gap-2 flex-wrap mt-3">
                <button className={`category-chip ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>
                  All
                </button>
                {categories.map((c) => (
                  <button key={c} className={`category-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && <div className="empty-state"><div className="empty-icon">↻</div><h5>Loading the collection</h5><p className="muted mb-0">Just a moment...</p></div>}
          {error && <div className="alert alert-danger border-0 rounded-4">{error}</div>}

          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
              <h5>No matching items</h5>
              <p className="muted mb-0">Try another search term or category.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="row">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
