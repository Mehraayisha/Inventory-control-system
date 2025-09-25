"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock_quantity: "", category_id: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products with better error handling
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
      setProducts([]);
    }
  };

  // Fetch categories with better error handling
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Safe statistics calculations with null checks
  const totalProducts = Array.isArray(products) ? products.length : 0;
  const totalStock = Array.isArray(products) 
    ? products.reduce((sum, p) => sum + (Number(p?.stock_quantity) || 0), 0) 
    : 0;
  const lowStockProducts = Array.isArray(products) 
    ? products.filter(p => (Number(p?.stock_quantity) || 0) < 10).length 
    : 0;
  const totalValue = Array.isArray(products) 
    ? products.reduce((sum, p) => {
        const price = Number(p?.price) || 0;
        const quantity = Number(p?.stock_quantity) || 0;
        return sum + (price * quantity);
      }, 0) 
    : 0;

  // Add new product with validation
  const handleAdd = async () => {
    if (!form.name?.trim() || !form.category_id) {
      alert("Name and Category are required");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price) || 0,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          category_id: parseInt(form.category_id),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add product: ${res.status}`);
      }

      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      setForm({ name: "", price: "", stock_quantity: "", category_id: "" });
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    if (!product) return;
    
    setEditId(product.product_id);
    setForm({
      name: product.product_name || "",
      price: product.price || "",
      stock_quantity: product.stock_quantity || "",
      category_id: product.category_id || "",
    });
  };

  // Update product with validation
  const handleUpdate = async () => {
    if (!form.name?.trim() || !form.category_id) {
      alert("Name and Category are required");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...form, 
          product_id: editId,
          name: form.name.trim(),
          price: parseFloat(form.price) || 0,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          category_id: parseInt(form.category_id),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update product: ${res.status}`);
      }

      const updated = await res.json();
      setProducts(prev => prev.map(p => (p.product_id === editId ? updated : p)));
      setEditId(null);
      setForm({ name: "", price: "", stock_quantity: "", category_id: "" });
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  // Delete product with confirmation
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      
      if (!res.ok) {
        throw new Error(`Failed to delete product: ${res.status}`);
      }

      setProducts(prev => prev.filter(p => p.product_id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchProducts();
              fetchCategories();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Products</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Products
              </h3>
              <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Stock */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Stock
              </h3>
              <p className="text-2xl font-bold text-green-600">{totalStock}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Low Stock Items
              </h3>
              <p className="text-2xl font-bold text-red-600">{lowStockProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Below 10 units</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Inventory Value
              </h3>
              <p className="text-2xl font-bold text-yellow-600">₹{totalValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form for Add/Edit */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black flex-1 min-w-48"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black w-32"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.stock_quantity}
            onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black w-32"
            min="0"
          />
          <select
            value={form.category_id}
            onChange={e => setForm({ ...form, category_id: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black w-48"
          >
            <option value="">Select Category</option>
            {Array.isArray(categories) && categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
          {editId ? (
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", price: "", stock_quantity: "", category_id: "" });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Product List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((p, index) => (
                  <tr key={p?.product_id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p?.product_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p?.product_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{Number(p?.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (p?.stock_quantity || 0) < 10 
                          ? 'bg-red-100 text-red-800' 
                          : (p?.stock_quantity || 0) < 20 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {p?.stock_quantity || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p?.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 hover:underline font-medium"
                          onClick={() => handleDelete(p?.product_id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No products found. Add your first product above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}