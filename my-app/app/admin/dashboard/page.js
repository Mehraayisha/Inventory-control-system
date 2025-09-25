// src/app/admin/dashboard/page.jsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSuppliers: 0,
    totalStock: 0,
    lowStockItems: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
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
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-lg">
        <div className="p-4 font-bold text-2xl border-b border-indigo-500">
          Admin Panel
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <a href="/admin/dashboard" className="bg-indigo-700 p-2 rounded-md font-medium">
            Dashboard
          </a>
          <a href="/admin/products" className="hover:bg-indigo-700 p-2 rounded-md">
            Products
          </a>
          <a href="/admin/orders" className="hover:bg-indigo-700 p-2 rounded-md">
            Orders
          </a>
          <a href="/admin/stock" className="hover:bg-indigo-700 p-2 rounded-md">
            Stock
          </a>
          <a href="/admin/reports" className="hover:bg-indigo-700 p-2 rounded-md">
            Reports
          </a>
          <a href="/admin/users" className="hover:bg-indigo-700 p-2 rounded-md">
            Users
          </a>
          <a href="/admin/settings" className="hover:bg-indigo-700 p-2 rounded-md">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-indigo-800">
          Dashboard Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md border-t-4 border-indigo-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-indigo-600">
                {loading ? '...' : stats.totalProducts}
              </p>
              <p className="text-gray-600">Products</p>
            </CardContent>
          </Card>
         
          <Card className="bg-white shadow-md border-t-4 border-blue-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-blue-600">
                {loading ? '...' : stats.totalSuppliers}
              </p>
              <p className="text-gray-600">Suppliers</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border-t-4 border-green-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-green-600">
                {loading ? '...' : stats.totalStock}
              </p>
              <p className="text-gray-600">Total Stock</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md border-t-4 border-red-500">
            <CardContent className="p-6 text-center">
              <p className="text-4xl font-bold text-red-600">
                {loading ? '...' : stats.lowStockItems}
              </p>
              <p className="text-gray-600">Low Stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts (placeholder now) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2 text-indigo-700">📊 Stock Trend</h2>
              <div className="h-40 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-2 text-indigo-700">📈 Orders Trend</h2>
              <div className="h-40 flex items-center justify-center text-gray-400">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </div>

       
         
      </main>
    </div>
  );
}
