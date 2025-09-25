"use client";

import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock_quantity: "", category_id: "" });
  const [editId, setEditId] = useState(null); // ID of product being edited

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/admin/products/api");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/admin/categories/api");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Add new product
  const handleAdd = async () => {
    if (!form.name || !form.category_id) {
      alert("Name and Category are required");
      return;
    }

    try {
      const res = await fetch("/admin/products/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity),
          category_id: parseInt(form.category_id),
        }),
      });
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setForm({ name: "", price: "", stock_quantity: "", category_id: "" });
    } catch (error) {
      console.error(error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditId(product.product_id);
    setForm({
      name: product.product_name,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
    });
  };

  // Update product
  // Update product
const handleUpdate = async () => {
  try {
    const res = await fetch("/admin/products/api", {
      method: "PUT", // <-- This is the line
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, product_id: editId }),
    });
    const updated = await res.json();
    setProducts(products.map(p => (p.product_id === editId ? updated : p)));
    setEditId(null);
    setForm({ name: "", price: "", stock_quantity: "", category_id: "" });
  } catch (error) {
    console.error(error);
  }
};


  // Delete product
  const handleDelete = async (id) => {
    try {
      await fetch(`/admin/products/api?id=${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.product_id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Form for Add/Edit */}
      <div className="mb-6 flex gap-2 flex-wrap ">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-40"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-24"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.stock_quantity}
          onChange={e => setForm({ ...form, stock_quantity: e.target.value })}
          className="border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-24"
        />
        <select
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
          className="border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black w-40"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>
        {editId ? (
          <button
            onClick={handleUpdate}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        )}
      </div>

      {/* Products Table */}
      <table className="w-full border border-blue-200 border-collapse shadow-lg">
        <thead className="bg-blue-200">
          <tr>
            <th className="border border-blue-300 px-4 py-2">ID</th>
            <th className="border border-blue-300 px-4 py-2">Name</th>
            <th className="border border-blue-300 px-4 py-2">Price</th>
            <th className="border border-blue-300 px-4 py-2">Quantity</th>
            <th className="border border-blue-300 px-4 py-2">Category</th>
            <th className="border border-blue-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white text-black">
          {products.map(p => (
            <tr key={p.product_id} className="hover:bg-blue-50 transition-colors">
              <td className="border border-blue-200 px-4 py-2">{p.product_id}</td>
              <td className="border border-blue-200 px-4 py-2">{p.product_name}</td>
              <td className="border border-blue-200 px-4 py-2">{p.price}</td>
              <td className="border border-blue-200 px-4 py-2">{p.stock_quantity}</td>
              <td className="border border-blue-200 px-4 py-2">{p.category_name}</td>
              <td className="border border-blue-200 px-4 py-2 flex gap-2">
                {editId === p.product_id ? (
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-00 hover:bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(p.product_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
