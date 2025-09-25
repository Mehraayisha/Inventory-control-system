"use client";

import { useEffect, useState } from "react";

export default function StaffProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from staff API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/staff/products/api");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-gray-600 mt-6">Loading products...</p>;
  if (error) return <p className="text-red-500 mt-6">{error}</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Products (View Only)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-right">Price</th>
              <th className="py-3 px-6 text-right">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr
                key={p.product_id}
                className={index % 2 === 0 ? "bg-gray-100 hover:bg-blue-50" : "bg-white hover:bg-blue-50"}
              >
                <td className="text-black py-3 px-6">{p.product_name}</td>
                <td className="text-black py-3 px-6">{p.category_name || "N/A"}</td>
                <td className="text-black py-3 px-6 text-right">${Number(p.price).toFixed(2)}</td>
                <td className="text-black py-3 px-6 text-right">{p.stock_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
