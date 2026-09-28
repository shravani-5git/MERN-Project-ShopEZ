import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [error, setError] = useState('');

  const loadCoupons = () => api.get('/coupons').then((res) => setCoupons(res.data));
  useEffect(() => { loadCoupons(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/coupons', { code, discountPercent: Number(discountPercent) });
      setCode(''); setDiscountPercent(''); loadCoupons();
    } catch (err) { setError(err.response?.data?.message || 'Could not create coupon'); }
  }

  async function toggleActive(coupon) {
    await api.put(`/coupons/${coupon._id}`, { active: !coupon.active });
    loadCoupons();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this coupon?')) return;
    await api.delete(`/coupons/${id}`);
    loadCoupons();
  }

  return (
    <main className="page-section">
      <div className="container">
        <div className="mb-4"><div className="product-category mb-2">Admin</div><h1 className="section-title">Coupons</h1><p className="muted">Create and control promotional discounts.</p></div>

        <form className="surface-card p-4 mb-4" onSubmit={handleSubmit}>
          <h5>Create a coupon</h5>
          {error && <div className="alert alert-danger border-0 rounded-3 py-2">{error}</div>}
          <div className="row g-2 mt-1">
            <div className="col-md-5"><input className="form-control" placeholder="Code, e.g. SAVE20" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required /></div>
            <div className="col-md-3"><input className="form-control" type="number" min="1" max="100" placeholder="Discount %" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} required /></div>
            <div className="col-md-4"><button className="btn btn-brand w-100" type="submit">Create coupon</button></div>
          </div>
        </form>

        {coupons.length === 0 ? <div className="empty-state">No coupons created yet.</div> : (
          <div className="data-card">
            <table className="table">
              <thead><tr><th>Code</th><th>Discount</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{coupons.map((c) => (
                <tr key={c._id}>
                  <td className="fw-bold">{c.code}</td><td>{c.discountPercent}%</td>
                  <td><span className={`status-badge ${c.active ? 'status-delivered' : 'status-cancelled'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                  <td><button className="btn btn-sm btn-outline-clean me-2" onClick={() => toggleActive(c)}>{c.active ? 'Deactivate' : 'Activate'}</button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
