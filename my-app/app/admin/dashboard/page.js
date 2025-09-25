// src/app/admin/dashboard/page.jsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import StockTrendChart from "@/components/StockTrendChart";
import OrderTrendChart from "@/components/OrderTrendChart";
// Assuming this component exists (placeholder for a real logout button)
// import LogoutButton from "@/components/LogoutButton"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalStock: 0,
    lowStockItems: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard'); 
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      setError('Error loading dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper component for clean, reusable stat cards
  const StatCard = ({ title, value, colorClass, loading }) => (
    <Card className={`bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] border-l-4 ${colorClass}`}>
      <CardContent className="p-6 text-left">
        <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
        <p className={`text-4xl font-extrabold mt-1 text-gray-800`}>
          {loading ? '...' : value}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Clean dark blue theme */}
      <aside className="w-64 bg-gray-800 text-white shadow-2xl flex flex-col">
        <div className="p-5 font-extrabold text-2xl border-b border-gray-700 text-blue-400">
          Admin Panel
        </div>
        <nav className="flex flex-col p-4 space-y-1 flex-1">
          {/* Active Dashboard Link */}
          <a href="/admin/dashboard" className="bg-blue-600 p-3 rounded-lg font-semibold transition duration-200">
            Dashboard
          </a>
          <a href="/admin/products" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Products
          </a>
          <a href="/admin/orders" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Orders
          </a>
          <a href="/admin/stock" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Stock
          </a>
          <a href="/admin/reports" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Reports
          </a>
          <a href="/admin/users" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Users
          </a>
          <a href="/admin/settings" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Settings
          </a>
        </nav>
        {/* Placeholder for Logout Button */}
        <div className="p-4 border-t border-gray-700">
            <button className="w-full text-left p-3 rounded-lg bg-red-600 hover:bg-red-700 transition">
              Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 border-b pb-3 border-blue-200">
          Dashboard Overview
        </h1>

        {error && <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded-lg">{error}</div>}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1: Total Products (Blue Accent) */}
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            colorClass="border-blue-500"
            loading={loading}
          />
          
          {/* Card 2: Total Suppliers (Cyan Accent) */}
          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers}
            colorClass="border-cyan-500"
            loading={loading}
          />
          
          {/* Card 3: Total Stock (Green Accent) */}
          <StatCard
            title="Total Stock Units"
            value={stats.totalStock}
            colorClass="border-green-500"
            loading={loading}
          />
          
          {/* Card 4: Low Stock (Red Accent) */}
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] border-l-4 border-red-500">
            <CardContent className="p-6 text-left">
              <p className="text-sm font-medium text-gray-500 uppercase">Low Stock</p>
              <p className="text-4xl font-extrabold mt-1 text-red-600">
                {loading ? '...' : stats.lowStockItems}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts Placeholder */}
          <Card className="bg-white shadow-lg lg:col-span-2 rounded-xl">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4 text-blue-700 border-b pb-2">📊 Stock and Order Trends</h2>
              {/* Combined chart placeholders */}
              <div className="h-60 flex flex-col md:flex-row items-center justify-around text-gray-400 space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/2 h-full border border-dashed rounded-lg flex items-center justify-center bg-gray-50"><StockTrendChart /></div>
                <div className="w-full md:w-1/2 h-full border border-dashed rounded-lg flex items-center justify-center bg-gray-50"><OrderTrendChart /></div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Products List */}
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4 text-blue-700 border-b pb-2">🕒 Recent Products</h2>
              <ul className="space-y-3">
                {loading ? (
                  <p className="text-gray-500">Loading recent products...</p>
                ) : stats.recentProducts.length === 0 ? (
                  <p className="text-gray-500">No recent products found.</p>
                ) : (
                  stats.recentProducts.map((product) => (
                    <li key={product.product_id} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg border-l-4 border-blue-300 hover:bg-gray-100 transition">
                      <span className="font-medium text-gray-800 truncate">{product.name}</span>
                      <span className="text-gray-600 font-semibold ml-2">
                          Qty: {product.stock_quantity}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}