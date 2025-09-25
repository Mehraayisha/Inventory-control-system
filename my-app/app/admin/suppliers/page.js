"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    address: ""
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      setError("Failed to load suppliers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/suppliers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm({ name: "", contact_email: "", contact_phone: "", address: "" });
      setEditingId(null);
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      setError("Failed to save supplier.");
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      name: supplier.name,
      contact_email: supplier.contact_email,
      contact_phone: supplier.contact_phone,
      address: supplier.address,
    });
    setEditingId(supplier.supplier_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
      fetchSuppliers();
    } catch (err) {
      console.error(err);
      setError("Failed to delete supplier.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 p-8">
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Supplier Management</h1>

        {/* Button to show Add Supplier form */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? (editingId ? "Editing Supplier" : "Cancel") : "Add Supplier"}
        </button>

        {/* Add / Edit Form */}
        {showForm && (
          <Card className="mb-6 bg-white shadow-md max-w-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                {editingId ? "Edit Supplier" : "Add New Supplier"}
              </h2>
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Supplier Name"
                  className="w-full max-w-sm p-2 border rounded"
                  required
                />
                <input
                  type="email"
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full max-w-sm p-2 border rounded"
                />
                <input
                  type="text"
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full max-w-sm p-2 border rounded"
                />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full max-w-sm p-2 border rounded"
                  rows={3}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  {editingId ? "Update Supplier" : "Add Supplier"}
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Supplier Table */}
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Suppliers List</h2>
            {loading ? (
              <p>Loading...</p>
            ) : suppliers.length === 0 ? (
              <p>No suppliers found.</p>
            ) : (
              <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.supplier_id} className="border-t hover:bg-gray-50 text-black">
                      <td className="p-3">{supplier.supplier_id}</td>
                      <td className="p-3">{supplier.name}</td>
                      <td className="p-3">{supplier.contact_email}</td>
                      <td className="p-3">{supplier.contact_phone}</td>
                      <td className="p-3">{supplier.address}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.supplier_id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
