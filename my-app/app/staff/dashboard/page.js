// src/app/admin/dashboard/page.jsx
"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import StockTrendChart from "@/components/StockTrendChart";

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
          <a href="/staff/products" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Products
          </a>
          <a href="/staff/stock" className="hover:bg-gray-700 p-3 rounded-lg transition duration-200">
            Stock
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
     
          
          {/* Charts Placeholder */}
          <Card className="bg-white shadow-lg lg:col-span-2 rounded-xl">
            <CardContent className="p-2">
              <h2 className="font-bold text-xl mb-4 text-blue-700 border-b pb-2">📊 Stock and Order Trends</h2>
              {/* Combined chart placeholders */}
              <div className="h-150 flex flex-col md:flex-row items-center justify-around text-gray-400 space-y-4 md:space-y-0 mx-auto">
               <StockTrendChart />
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Products List */}
          
            
      
      </main>
    </div>
  );
}