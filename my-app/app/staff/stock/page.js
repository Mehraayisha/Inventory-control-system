'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ReduceStockModal } from '../../admin/stock/modals.js';

// 📦 Dashboard Overview Cards Component (Staff View)
const StaffDashboardOverview = ({ stockData }) => {
  const totalProducts = stockData.length;
  const totalStockQuantity = stockData.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockCount = stockData.filter(item => item.currentStock < item.reorderLevel && item.currentStock > 0).length;
  const outOfStockCount = stockData.filter(item => item.currentStock === 0).length;

  const cards = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: '📦',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'Total Stock Quantity',
      value: totalStockQuantity.toLocaleString(),
      icon: '📊',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-green-500'
    },
    {
      title: 'Low Stock Items',
      value: lowStockCount,
      icon: '⚠️',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-yellow-500'
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      icon: '🚫',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-l-red-500'
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

// 🔍 Search and Filter Component (Staff View)
const StaffSearchAndFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Search & Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600"
          >
            <option value="">All Categories</option>
            {categories.map(category => {
              const key = category.category_id ?? category.id ?? category.name;
              const label = category.category_name ?? category.name ?? 'Unnamed';
              return (
                <option key={key} value={label}>{label}</option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-600"
          >
            <option value="">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// 📋 Staff Stock Inventory Table Component (Limited Actions)
const StaffStockTable = ({ stockData, onDeleteStock, onReduceStock, sortConfig, setSortConfig }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowHighlight = (item) => {
    if (item.currentStock === 0) return 'bg-red-50 border-l-4 border-red-400';
    if (item.currentStock < item.reorderLevel) return 'bg-yellow-50 border-l-4 border-yellow-400';
    return '';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  const handleViewDetails = (item) => {
    alert(`📦 Product Details:

🏷️ Product ID: ${item.productId}
📝 Name: ${item.name}
📋 Description: ${item.description || 'No description'}
🏭 Category: ${item.category}
💰 Unit Price: $${item.unitPrice}
📦 Current Stock: ${item.currentStock} units
⚠️ Reorder Level: ${item.reorderLevel} units
📊 Status: ${item.status}
📅 Last Updated: ${item.lastUpdated}

ℹ️ As a staff member, you can view product details and delete products but cannot modify stock levels or product information.`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
        <h2 className="text-xl font-semibold text-gray-800">📋 Stock Inventory (Staff View)</h2>
        <p className="text-sm text-orange-600 mt-1">
          👤 Staff Access: View details and delete products only | Showing {stockData.length} products
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('productId')}
              >
                Product ID {getSortIcon('productId')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Product Name {getSortIcon('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('unitPrice')}
              >
                Unit Price {getSortIcon('unitPrice')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('currentStock')}
              >
                Current Stock {getSortIcon('currentStock')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockData.map((item) => (
              <tr key={item.id} className={getRowHighlight(item)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${item.unitPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{item.currentStock}</div>
                  <div className="text-xs text-gray-500">units</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {/* Staff can view details, reduce stock (OUT transaction), and delete */}
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs transition-colors"
                      title="View Product Details"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => onReduceStock(item)}
                      className="text-amber-600 hover:text-amber-900 px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded text-xs transition-colors"
                      title="Reduce Stock"
                    >
                      ➖ Reduce
                    </button>
                    <button
                      onClick={() => onDeleteStock(item)}
                      className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-xs transition-colors"
                      title="Delete Product"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ⚠️ Staff Low Stock Alerts Component (Read-only)
const StaffLowStockAlerts = ({ stockData }) => {
  const lowStockItems = stockData.filter(item => item.currentStock < item.reorderLevel && item.currentStock > 0);
  const outOfStockItems = stockData.filter(item => item.currentStock === 0);

  if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ All Items Well Stocked</h3>
        <p className="text-green-700">No low stock or out of stock items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Stock Alerts (Read-Only View)</h3>
      <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
        <p className="text-orange-700 text-sm">
          ℹ️ <strong>Staff Note:</strong> You can view stock alerts but cannot add stock. Contact an administrator to restock items.
        </p>
      </div>
      
      {outOfStockItems.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium text-red-600 mb-2">🚫 Out of Stock ({outOfStockItems.length})</h4>
          <div className="space-y-2">
            {outOfStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-red-50 p-3 rounded-md">
                <div>
                  <span className="font-medium text-red-800">{item.name}</span>
                  <span className="text-red-600 text-sm ml-2">({item.productId})</span>
                </div>
                <span className="text-red-600 text-sm font-medium">Contact Admin to Restock</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowStockItems.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-yellow-600 mb-2">⚠️ Low Stock ({lowStockItems.length})</h4>
          <div className="space-y-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-yellow-50 p-3 rounded-md">
                <div>
                  <span className="font-medium text-yellow-800">{item.name}</span>
                  <span className="text-yellow-600 text-sm ml-2">
                    ({item.currentStock}/{item.reorderLevel})
                  </span>
                </div>
                <span className="text-yellow-600 text-sm font-medium">Admin Action Required</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 📄 Staff Transactions Log Component (Read-only)
const StaffTransactionsLog = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  const currentTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeColor = (type) => {
    switch (type) {
      case 'IN': return 'bg-green-100 text-green-800';
      case 'OUT': return 'bg-red-100 text-red-800';
      case 'ADJUSTMENT': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
        <h2 className="text-xl font-semibold text-gray-800">📄 Stock Transactions Log (Read-Only)</h2>
        <p className="text-sm text-blue-600 mt-1">👤 Staff View: Transaction history for reference only</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, transactions.length)} of {transactions.length} transactions
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// 📦 Staff Stock Page Component (Limited Permissions)
const StaffStockPage = ({ userName = 'Staff User' }) => {
  const [stockData, setStockData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategoriesData] = useState([]);
  const [reduceStockModal, setReduceStockModal] = useState({ isOpen: false, product: null });

  // 🔄 Load stock data from API
  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stock');
      if (response.ok) {
        const data = await response.json();
        setStockData(data);
        console.log('✅ Stock data loaded from database (Staff View):', data.length, 'products');
      } else {
        console.error('Failed to fetch stock data - Response not OK');
        setStockData([]);
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setStockData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Load transaction data from API
  const loadTransactionData = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
        console.log('✅ Transaction data loaded from database (Staff View):', data.length, 'transactions');
      } else {
        console.error('Failed to fetch transaction data - Response not OK');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setTransactions([]);
    }
  };

  // 🔄 Load categories data from API
  const loadCategoriesData = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategoriesData(data);
      } else {
        console.error('Failed to fetch categories data');
      }
    } catch (error) {
      console.error('Error fetching categories data:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadStockData();
    loadTransactionData();
    loadCategoriesData();
  }, []);

  // Filter and sort stock data
  const filteredAndSortedStockData = useMemo(() => {
    let filtered = stockData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort the filtered data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [stockData, searchTerm, selectedCategory, selectedStatus, sortConfig]);

  const handleReduceStock = (item) => {
    setReduceStockModal({ isOpen: true, product: item });
  };

  const handleReduceStockSubmit = async (data) => {
    try {
      const transactionData = {
        productId: data.productId,
        transactionType: 'OUT',
        quantity: data.quantity,
        notes: data.reason,
        userId: 2 // placeholder staff user id
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        await loadStockData();
        await loadTransactionData();
        alert('✅ Stock reduced successfully.');
      } else {
        alert('❌ Failed to reduce stock.');
      }
    } catch (error) {
      console.error('Error reducing stock (staff):', error);
      alert('❌ Error reducing stock.');
    }
  };

  // Staff can only delete products (with confirmation)
  const handleDeleteStock = (item) => {
    if (confirm(`⚠️ Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone. As a staff member, you have delete permissions but cannot add or modify stock levels.`)) {
      // TODO: Implement delete API call
      setStockData(prev => prev.filter(stock => stock.id !== item.id));
      alert(`✅ Product "${item.name}" has been deleted successfully.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📦 Stock Management System</h1>
            <p className="text-gray-600">Welcome, {userName} 
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 ml-2">
                👤 Staff Access
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-orange-700 text-sm font-medium">🔒 Limited Access Mode</p>
              <p className="text-orange-600 text-xs">View & Delete Only</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading stock data...</span>
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <StaffDashboardOverview stockData={stockData} />

            {/* Low Stock Alerts (Read-only) */}
            <StaffLowStockAlerts stockData={stockData} />

            {/* Search and Filter */}
            <StaffSearchAndFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              categories={categories}
            />

            {/* Stock Table */}
            <div className="mb-8">
              <StaffStockTable
                stockData={filteredAndSortedStockData}
                onDeleteStock={handleDeleteStock}
                onReduceStock={handleReduceStock}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
            </div>
            {/* Reduce Stock Modal */}
            <ReduceStockModal
              isOpen={reduceStockModal.isOpen}
              onClose={() => setReduceStockModal({ isOpen: false, product: null })}
              product={reduceStockModal.product}
              onSubmit={handleReduceStockSubmit}
            />
            {/* Transactions Log */}
            <StaffTransactionsLog transactions={transactions} />

           
          </>
        )}
      </div>
    </div>
  );
};

export default StaffStockPage;