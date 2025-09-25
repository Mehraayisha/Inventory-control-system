'use client';

import React, { useState, useEffect, useMemo } from 'react';

// 📊 Orders Overview Component
const OrdersOverview = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

  const cards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: '📋',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: '⏳',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-yellow-500'
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: '✅',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-500'
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: '💰',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-l-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow-md border-l-4 ${card.borderColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</p>
            </div>
            <span className="text-2xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// 🔍 Search and Filter Component
const SearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedStatus,
  setSelectedStatus,
  selectedSupplier,
  setSelectedSupplier,
  suppliers
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Search & Filter Orders</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
          <input
            type="text"
            placeholder="Search by order ID, supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier.supplier_id} value={supplier.supplier_name}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// 📋 Orders Table Component
const OrdersTable = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">📋 Purchase Orders</h2>
        <p className="text-sm text-gray-600 mt-1">Showing {orders.length} orders</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.order_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.supplier_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity_ordered}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${order.unit_price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${order.total_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.order_date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs transition-colors"
                    title="View Order Details"
                  >
                    👁️ View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 📦 Main Admin Orders Page Component
const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load orders data from API
  const loadOrdersData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        console.log('✅ Orders data loaded:', data.length, 'orders');
      } else {
        console.error('Failed to fetch orders data');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders data:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load suppliers data from API
  const loadSuppliersData = async () => {
    try {
      const response = await fetch('/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
        console.log('✅ Suppliers data loaded:', data.length, 'suppliers');
      } else {
        console.error('Failed to fetch suppliers data');
      }
    } catch (error) {
      console.error('Error fetching suppliers data:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadOrdersData();
    loadSuppliersData();
  }, []);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.order_id.toString().includes(searchTerm.toLowerCase()) ||
                           order.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === '' || order.status === selectedStatus;
      const matchesSupplier = selectedSupplier === '' || order.supplier_name === selectedSupplier;
      
      return matchesSearch && matchesStatus && matchesSupplier;
    });
  }, [orders, searchTerm, selectedStatus, selectedSupplier]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🛒 Orders Management</h1>
            <p className="text-gray-600">Manage purchase orders and supplier orders</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            ➕ Create New Order
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading orders...</span>
          </div>
        ) : (
          <>
            {/* Orders Overview */}
            <OrdersOverview orders={orders} />

            {/* Search and Filter */}
            <SearchAndFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={setSelectedSupplier}
              suppliers={suppliers}
            />

            {/* Orders Table */}
            <OrdersTable orders={filteredOrders} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;