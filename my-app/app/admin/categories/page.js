"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

  // Calculate statistics
  const totalCategories = categories.length;
  const categoriesWithProducts = categories.filter(cat => 
    products.some(product => product.category_id === cat.category_id)
  ).length;
  const emptyCategoriesCount = totalCategories - categoriesWithProducts;
  const mostUsedCategory = categories.reduce((max, cat) => {
    const productCount = products.filter(product => product.category_id === cat.category_id).length;
    const maxCount = products.filter(product => product.category_id === max.category_id).length;
    return productCount > maxCount ? cat : max;
  }, categories[0] || {});

  // Add category
  async function handleAdd() {
    if (!newCategoryName.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: newCategoryName.trim(), description: newCategoryDesc.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      setNewCategoryName("");
      setNewCategoryDesc("");
      fetchCategories();
      alert("Category added successfully!");
    } catch (err) {
      alert(err.message);
    }
  }

  // Start editing
  function startEdit(category) {
    setEditingId(category.category_id);
    setEditingName(category.category_name);
    setEditingDesc(category.description || "");
  }

  // Save edited category
  async function handleEditSave() {
    if (!editingName.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      const res = await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_name: editingName.trim(), description: editingDesc.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update category");
      setEditingId(null);
      fetchCategories();
      alert("Category updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  }

  // Delete category
  async function handleDelete(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;
  try {
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete category");
    fetchCategories();
    alert("Category deleted successfully!");
  } catch (err) {
    alert(err.message);
  }
}

  if (loading) return <p className="text-gray-600 mt-6">Loading categories...</p>;
  if (error) return <p className="text-red-500 mt-6">{error}</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Categories</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Categories
              </h3>
              <p className="text-2xl font-bold text-blue-600">{totalCategories}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories with Products */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Active Categories
              </h3>
              <p className="text-2xl font-bold text-green-600">{categoriesWithProducts}</p>
              <p className="text-xs text-gray-500 mt-1">With products</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Empty Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Empty Categories
              </h3>
              <p className="text-2xl font-bold text-yellow-600">{emptyCategoriesCount}</p>
              <p className="text-xs text-gray-500 mt-1">No products</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Most Used Category */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Most Used Category
              </h3>
              <p className="text-lg font-bold text-purple-600 truncate">
                {mostUsedCategory?.category_name || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {products.filter(p => p.category_id === mostUsedCategory?.category_id).length} products
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 min-w-48"
          />
          <input
            type="text"
            placeholder="Description"
            value={newCategoryDesc}
            onChange={(e) => setNewCategoryDesc(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 min-w-48"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            disabled={!newCategoryName.trim()}
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Categories List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Count</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? categories.map((c, index) => (
                <tr
                  key={c.category_id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.category_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingId === c.category_id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      c.category_name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === c.category_id ? (
                      <input
                        type="text"
                        value={editingDesc}
                        onChange={(e) => setEditingDesc(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      c.description || "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      products.filter(p => p.category_id === c.category_id).length === 0
                        ? 'bg-gray-100 text-gray-800'
                        : products.filter(p => p.category_id === c.category_id).length < 5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {products.filter(p => p.category_id === c.category_id).length}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-center gap-4">
                      {editingId === c.category_id ? (
                        <>
                          <button
                            onClick={handleEditSave}
                            className="text-green-600 hover:text-green-800 hover:underline font-medium"
                            disabled={!editingName.trim()}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-800 hover:underline font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(c)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.category_id)}
                            className="text-red-600 hover:text-red-800 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No categories found
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