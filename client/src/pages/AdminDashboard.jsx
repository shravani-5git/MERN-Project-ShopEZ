import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => setStats(res.data));
  }, []);

  return (
    <main className="page-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
          <div><div className="product-category mb-2">ShopEZ admin</div><h1 className="section-title mb-1">Control center</h1><p className="muted mb-0">Manage your store from one place.</p></div>
        </div>

        <div className="admin-nav d-flex gap-1 flex-wrap mb-4">
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/coupons">Coupons</Link>
        </div>

        {!stats && <div className="empty-state">Loading analytics...</div>}

        {stats && (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4"><div className="metric-card"><div className="muted small">Total sales</div><div className="metric-value mt-2">${stats.totalSales.toFixed(2)}</div></div></div>
              <div className="col-md-4"><div className="metric-card"><div className="muted small">Orders processed</div><div className="metric-value mt-2">{stats.totalOrders}</div></div></div>
              <div className="col-md-4"><div className="metric-card"><div className="muted small">Products listed</div><div className="metric-value mt-2">{stats.totalProducts}</div></div></div>
            </div>

            <div className="surface-card p-4">
              <h5>Top selling items</h5>
              <p className="muted small">Products ranked by units sold.</p>
              {stats.topProducts.length === 0 ? <p className="muted mb-0">No sales yet.</p> : (
                <div className="data-card mt-3">
                  <table className="table"><thead><tr><th>Product</th><th>Units sold</th></tr></thead>
                    <tbody>{stats.topProducts.map((p) => <tr key={p.name}><td className="fw-semibold">{p.name}</td><td>{p.quantitySold}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
