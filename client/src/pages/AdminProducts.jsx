import { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = { name:'', description:'', price:'', category:'', imageUrl:'', stock:'', discountPercent:'' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadProducts = () => api.get('/products').then((res) => setProducts(res.data));
  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      discountPercent: Number(form.discountPercent) || 0,
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name, description: product.description, price: product.price,
      category: product.category, imageUrl: product.imageUrl, stock: product.stock,
      discountPercent: product.discountPercent,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${productId}`);
    loadProducts();
  }

  return (
    <main className="page-section">
      <div className="container">
        <div className="mb-4"><div className="product-category mb-2">Admin</div><h1 className="section-title">Products</h1><p className="muted">Add, edit and maintain your catalog.</p></div>

        <form className="surface-card p-4 mb-4" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">{editingId ? 'Edit product' : 'Add a product'}</h5>
            {editingId && <button className="btn btn-sm btn-outline-clean" type="button" onClick={resetForm}>Cancel edit</button>}
          </div>
          {error && <div className="alert alert-danger border-0 rounded-3 py-2">{error}</div>}
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" name="name" placeholder="Product name" value={form.name} onChange={handleChange} required /></div>
            <div className="col-md-4"><input className="form-control" name="category" placeholder="Category" value={form.category} onChange={handleChange} required /></div>
            <div className="col-md-4"><input className="form-control" name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} /></div>
            <div className="col-12"><textarea className="form-control" name="description" rows="3" placeholder="Product description" value={form.description} onChange={handleChange} required /></div>
            <div className="col-md-3"><input className="form-control" name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required /></div>
            <div className="col-md-3"><input className="form-control" name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} required /></div>
            <div className="col-md-3"><input className="form-control" name="discountPercent" type="number" min="0" max="100" placeholder="Discount %" value={form.discountPercent} onChange={handleChange} /></div>
            <div className="col-md-3"><button className="btn btn-brand w-100 h-100" type="submit">{editingId ? 'Save changes' : 'Add product'}</button></div>
          </div>
        </form>

        {products.length === 0 ? <div className="empty-state">No products in the catalog.</div> : (
          <div className="data-card">
            <table className="table">
              <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>{products.map((p) => (
                <tr key={p._id}>
                  <td className="fw-semibold">{p.name}</td><td>{p.category}</td><td>${p.price.toFixed(2)}</td><td>{p.discountPercent}%</td><td>{p.stock}</td>
                  <td><button className="btn btn-sm btn-outline-clean me-2" onClick={() => handleEdit(p)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
