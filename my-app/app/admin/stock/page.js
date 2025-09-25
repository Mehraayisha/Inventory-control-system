'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AddStockModal, ReduceStockModal, EditStockModal } from './modals.js';

// 📦 Dashboard Overview Cards Component
const DashboardOverview = ({ stockData }) => {
  const totalProducts = stockData.length;
  const totalStockQuantity = stockData.reduce((sum, item) => sum + item.currentStock, 0);
  const totalStockValue = stockData.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
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
      title: 'Total Stock Value',
      value: `$${totalStockValue.toLocaleString()}`,
      icon: '💰',
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-l-purple-500'
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
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
  selectedCategory, 
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Search & Filter</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            📊 View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

// 📋 Stock Inventory Table Component
const StockTable = ({ stockData, userRole, onAddStock, onReduceStock, onEditStock, onDeleteStock, sortConfig, setSortConfig }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">📋 Stock Inventory</h2>
        <p className="text-sm text-gray-600 mt-1">Showing {stockData.length} products</p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{item.description}</td>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reorderLevel}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lastUpdated}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {userRole === 'admin' ? (
                      // Admin can do everything
                      <>
                        <button
                          onClick={() => onAddStock(item)}
                          className="text-green-600 hover:text-green-900 px-2 py-1 bg-green-100 hover:bg-green-200 rounded text-xs transition-colors"
                          title="Add Stock"
                        >
                          ➕ Add
                        </button>
                        <button
                          onClick={() => onReduceStock(item)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs transition-colors"
                          title="Reduce Stock"
                        >
                          ➖ Reduce
                          
                        </button>
                        <button
                          onClick={() => onEditStock(item)}
                          className="text-yellow-600 hover:text-yellow-900 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded text-xs transition-colors"
                          title="Edit Product Info"
                        >
                          📝 Edit
                        </button>
                        <button
                          onClick={() => onDeleteStock(item)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-xs transition-colors"
                          title="Delete Product"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      // Staff can only delete and view details
                      <>
                        <button
                          onClick={() => alert(`Product Details:\nName: ${item.name}\nStock: ${item.currentStock}\nPrice: $${item.unitPrice}\nCategory: ${item.category}`)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs transition-colors"
                          title="View Product Details"
                        >
                          �️ View
                        </button>
                        <button
                          onClick={() => onDeleteStock(item)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-xs transition-colors"
                          title="Delete Product"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
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

// ⚠️ Low Stock Alerts Component
const LowStockAlerts = ({ stockData, onAddStock, userRole }) => {
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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Stock Alerts</h3>
      
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
                {userRole === 'admin' && (
                  <button
                    onClick={() => onAddStock(item)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    ➕ Add Stock
                  </button>
                )}
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
                {userRole === 'admin' && (
                  <button
                    onClick={() => onAddStock(item)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    ➕ Add Stock
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 📄 Stock Transactions Log Component
const TransactionsLog = ({ transactions, userRole }) => {
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
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">📄 Stock Transactions Log</h2>
        {userRole === 'admin' && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            📊 Export Log
          </button>
        )}
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

// 📦 Main Stock Page Component
const StockPage = ({ userRole = 'admin', userName = 'Demo User' }) => {
  const [stockData, setStockData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategoriesData] = useState([]);
  
  // Modal states
  const [addStockModal, setAddStockModal] = useState({ isOpen: false, product: null });
  const [reduceStockModal, setReduceStockModal] = useState({ isOpen: false, product: null });
  const [editStockModal, setEditStockModal] = useState({ isOpen: false, product: null });

  // 🔄 Load stock data from API
  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stock');
      if (response.ok) {
        const data = await response.json();
        setStockData(data);
        console.log('✅ Stock data loaded from database:', data.length, 'products');
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
        console.log('✅ Transaction data loaded from database:', data.length, 'transactions');
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

  // Get unique categories and suppliers from stockData
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(stockData.map(item => item.category)));
  }, [stockData]);

  const suppliers = useMemo(() => {
    return Array.from(new Set(stockData.map(item => item.supplier).filter(Boolean)));
  }, [stockData]);

  // Filter and sort stock data
  const filteredAndSortedStockData = useMemo(() => {
    let filtered = stockData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchesSupplier = selectedSupplier === '' || item.supplier === selectedSupplier;
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesSupplier && matchesStatus;
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
  }, [stockData, searchTerm, selectedCategory, selectedSupplier, selectedStatus, sortConfig]);

  // Stock action handlers
  const handleAddStock = (item) => {
    setAddStockModal({ isOpen: true, product: item });
  };

  const handleReduceStock = (item) => {
    setReduceStockModal({ isOpen: true, product: item });
  };

  const handleEditStock = (item) => {
    setEditStockModal({ isOpen: true, product: item });
  };

  const handleDeleteStock = (item) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      setStockData(prev => prev.filter(stock => stock.id !== item.id));
    }
  };

  // 📊 Export Report Functions
  const generateCSVContent = (data, reportType = 'stock') => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      // Add report header
      `# ${reportType.toUpperCase()} REPORT`,
      `# Generated on: ${new Date().toLocaleString()}`,
      `# Total Records: ${data.length}`,
      '', // Empty line
      // CSV Headers
      headers.join(','),
      // CSV Data
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return value.toString().includes(',') || value.toString().includes('"') 
            ? `"${value.toString().replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadFile = (content, filename, type = 'text/csv') => {
    const BOM = '\uFEFF'; // Excel UTF-8 BOM
    const blob = new Blob([BOM + content], { type: `${type};charset=utf-8;` });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    }
    return false;
  };

  const handleExportReport = () => {
    try {
      // Calculate summary statistics
      const totalProducts = filteredAndSortedStockData.length;
      const totalValue = filteredAndSortedStockData.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);
      const lowStockItems = filteredAndSortedStockData.filter(item => item.currentStock < item.reorderLevel && item.currentStock > 0).length;
      const outOfStockItems = filteredAndSortedStockData.filter(item => item.currentStock === 0).length;

      // Prepare comprehensive export data
      const exportData = filteredAndSortedStockData.map(item => ({
        'Product ID': item.id,
        'Product Name': item.name,
        'Category': item.category,
        'Current Stock': item.currentStock,
        'Unit Price': item.unitPrice.toFixed(2),
        'Stock Value': (item.currentStock * item.unitPrice).toFixed(2),
        'Reorder Level': item.reorderLevel,
        'Stock Status': item.currentStock === 0 ? 'Out of Stock' : 
                       item.currentStock < item.reorderLevel ? 'Low Stock' : 'In Stock',
        'Stock Health': item.currentStock === 0 ? 'Critical' :
                       item.currentStock < item.reorderLevel ? 'Warning' : 'Good',
        'Supplier': item.supplier || 'N/A',
        'Location': item.location || 'N/A',
        'Last Updated': new Date(item.lastUpdated || Date.now()).toLocaleDateString(),
        'Days Since Update': Math.floor((Date.now() - new Date(item.lastUpdated || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
      }));

      // Add summary data at the beginning
      const summaryData = [
        { 'Metric': 'Total Products', 'Value': totalProducts },
        { 'Metric': 'Total Stock Value', 'Value': `$${totalValue.toFixed(2)}` },
        { 'Metric': 'Low Stock Items', 'Value': lowStockItems },
        { 'Metric': 'Out of Stock Items', 'Value': outOfStockItems },
        { 'Metric': 'Stock Health Score', 'Value': `${Math.round((totalProducts - outOfStockItems - lowStockItems) / totalProducts * 100)}%` }
      ];

      // Generate CSV with summary
      const summaryCSV = generateCSVContent(summaryData, 'Stock Summary');
      const detailsCSV = generateCSVContent(exportData, 'Stock Details');
      
      const fullCSV = [
        summaryCSV,
        '\n\n# DETAILED STOCK REPORT\n',
        detailsCSV
      ].join('\n');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      const filename = `inventory-stock-report-${timestamp}.csv`;

      // Download file
      if (downloadFile(fullCSV, filename)) {
        // Show detailed success message
        const message = [
          '✅ Stock Report Exported Successfully!',
          `📄 File: ${filename}`,
          `📊 Records: ${exportData.length} products`,
          `💰 Total Value: $${totalValue.toFixed(2)}`,
          `⚠️  Alerts: ${lowStockItems} low stock, ${outOfStockItems} out of stock`,
          '',
          'The report includes:',
          '• Product inventory details',
          '• Stock valuation',
          '• Reorder recommendations',
          '• Stock health analysis'
        ].join('\n');
        
        alert(message);
      } else {
        throw new Error('Download not supported in this browser');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export report. Please try again.\n\nError: ' + error.message);
    }
  };

  // Modal submit handlers
  const handleAddStockSubmit = async (data) => {
    try {
      const transactionData = {
        productId: data.productId,
        transactionType: 'IN',
        quantity: data.quantity,
        notes: data.reason || data.supplier,
        userId: 1 // This should come from actual user session
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        // Reload data to get fresh stock counts
        await loadStockData();
        await loadTransactionData();
      } else {
        console.error('Failed to add stock');
        alert('Failed to add stock. Please try again.');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Error adding stock. Please try again.');
    }
  };

  const handleReduceStockSubmit = async (data) => {
    try {
      const transactionData = {
        productId: data.productId,
        transactionType: 'OUT',
        quantity: data.quantity,
        notes: data.reason,
        userId: 1 // This should come from actual user session
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        // Reload data to get fresh stock counts
        await loadStockData();
        await loadTransactionData();
      } else {
        console.error('Failed to reduce stock');
        alert('Failed to reduce stock. Please try again.');
      }
    } catch (error) {
      console.error('Error reducing stock:', error);
      alert('Error reducing stock. Please try again.');
    }
  };

  const handleEditStockSubmit = async (data) => {
    try {
      const response = await fetch('/api/stock', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Reload data to get fresh information
        await loadStockData();
      } else {
        console.error('Failed to update product');
        alert('Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📦 Stock Management System</h1>
            <p className="text-gray-600">Welcome, {userName} ({userRole})</p>
          </div>
          {userRole === 'admin' && (
            <div className="flex space-x-3">
              <button
                onClick={handleExportReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                title="Export comprehensive stock report with analytics"
              >
                <span>📊</span>
                <span>Export Full Report</span>
                <span className="text-xs bg-blue-500 px-2 py-1 rounded-full ml-1">
                  {filteredAndSortedStockData.length} items
                </span>
              </button>
              
              <button
                onClick={() => {
                  const lowStockItems = filteredAndSortedStockData.filter(item => 
                    item.currentStock < item.reorderLevel || item.currentStock === 0
                  );
                  
                  if (lowStockItems.length === 0) {
                    alert('✅ No low stock or out of stock items found!');
                    return;
                  }
                  
                  const exportData = lowStockItems.map(item => ({
                    'Product ID': item.id,
                    'Product Name': item.name,
                    'Category': item.category,
                    'Current Stock': item.currentStock,
                    'Reorder Level': item.reorderLevel,
                    'Shortage': item.reorderLevel - item.currentStock,
                    'Unit Price': item.unitPrice.toFixed(2),
                    'Reorder Cost': ((item.reorderLevel - item.currentStock) * item.unitPrice).toFixed(2),
                    'Status': item.currentStock === 0 ? 'OUT OF STOCK' : 'LOW STOCK',
                    'Priority': item.currentStock === 0 ? 'URGENT' : 'HIGH',
                    'Supplier': item.supplier || 'N/A'
                  }));

                  const csvContent = generateCSVContent(exportData, 'Low Stock Alert');
                  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
                  const filename = `low-stock-alert-${timestamp}.csv`;
                  
                  if (downloadFile(csvContent, filename)) {
                    alert(`🚨 Low Stock Report Exported!\n📄 File: ${filename}\n⚠️  ${lowStockItems.length} items need attention`);
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                title="Export only low stock and out of stock items"
              >
                <span>⚠️</span>
                <span>Low Stock</span>
                <span className="text-xs bg-amber-500 px-2 py-1 rounded-full ml-1">
                  {filteredAndSortedStockData.filter(item => item.currentStock < item.reorderLevel || item.currentStock === 0).length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading stock data...</span>
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <DashboardOverview stockData={stockData} />

            {/* Low Stock Alerts */}
            <LowStockAlerts stockData={stockData} onAddStock={handleAddStock} userRole={userRole} />

            {/* Search and Filter */}
            <SearchAndFilter
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
              <StockTable
                stockData={filteredAndSortedStockData}
                userRole={userRole}
                onAddStock={handleAddStock}
                onReduceStock={handleReduceStock}
                onEditStock={handleEditStock}
                onDeleteStock={handleDeleteStock}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
            </div>

            {/* Transactions Log */}
            <TransactionsLog transactions={transactions} userRole={userRole} />

            {/* Role Information */}
          
          </>
        )}

        {/* Modals */}
        <AddStockModal
          isOpen={addStockModal.isOpen}
          onClose={() => setAddStockModal({ isOpen: false, product: null })}
          product={addStockModal.product}
          onSubmit={handleAddStockSubmit}
        />

        <ReduceStockModal
          isOpen={reduceStockModal.isOpen}
          onClose={() => setReduceStockModal({ isOpen: false, product: null })}
          product={reduceStockModal.product}
          onSubmit={handleReduceStockSubmit}
        />

        {userRole === 'admin' && (
          <EditStockModal
            isOpen={editStockModal.isOpen}
            onClose={() => setEditStockModal({ isOpen: false, product: null })}
            product={editStockModal.product}
            onSubmit={handleEditStockSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default StockPage;