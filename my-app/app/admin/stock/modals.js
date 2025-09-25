'use client';

import React, { useState } from 'react';

// 📝 Add Stock Modal Component
export const AddStockModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    supplier: product?.supplier || '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.quantity && parseInt(formData.quantity) > 0) {
      onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity),
        productId: product.id,
        productName: product.name,
        type: 'IN'
      });
      onClose();
      setFormData({ quantity: '', date: new Date().toISOString().split('T')[0], supplier: product?.supplier || '', reason: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">➕ Add Stock</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-medium text-gray-800">{product?.name}</p>
          <p className="text-sm text-gray-600">ID: {product?.productId}</p>
          <p className="text-sm text-gray-600">Current Stock: {product?.currentStock}</p>
          <p className="text-sm text-gray-600">Category: {product?.category}</p>
          {product?.description && (
            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity to Add *
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Supplier name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason/Notes
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Reason for adding stock..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              ➕ Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 📝 Reduce Stock Modal Component
export const ReduceStockModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const quantity = parseInt(formData.quantity);
    if (quantity > 0 && quantity <= product.currentStock) {
      onSubmit({
        ...formData,
        quantity,
        productId: product.id,
        productName: product.name,
        type: 'OUT'
      });
      onClose();
      setFormData({ quantity: '', date: new Date().toISOString().split('T')[0], reason: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">➖ Reduce Stock</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-medium text-gray-800">{product?.name}</p>
          <p className="text-sm text-gray-600">ID: {product?.productId}</p>
          <p className="text-sm text-gray-600">Available Stock: {product?.currentStock}</p>
          <p className="text-sm text-gray-600">Category: {product?.category}</p>
          {product?.description && (
            <p className="text-xs text-gray-500 mt-1">{product.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity to Reduce *
            </label>
            <input
              type="number"
              min="1"
              max={product?.currentStock}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter quantity"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {product?.currentStock} units
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select reason...</option>
              <option value="Sale">Sale</option>
              <option value="Damaged">Damaged</option>
              <option value="Returned">Returned</option>
              <option value="Internal Use">Internal Use</option>
              <option value="Lost">Lost</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ➖ Reduce Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 📝 Edit Stock Modal Component (Admin Only)
export const EditStockModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    categoryId: product?.categoryId || '',
    unitPrice: product?.unitPrice || '',
    currentStock: product?.currentStock || '',
    reorderLevel: product?.reorderLevel || ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId || '',
        unitPrice: product.unitPrice,
        currentStock: product.currentStock,
        reorderLevel: product.reorderLevel
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        id: product.id,
        unitPrice: parseFloat(formData.unitPrice),
        currentStock: parseInt(formData.currentStock),
        reorderLevel: parseInt(formData.reorderLevel)
      });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📝 Edit Product Information</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-yellow-50 rounded">
          <p className="font-medium text-yellow-800">Product ID: {product?.productId}</p>
          <p className="text-sm text-yellow-700">⚠️ Admin Only - Use with caution</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows="3"
              placeholder="Product description..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reorder Level *
              </label>
              <input
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Stock *
            </label>
            <input
              type="number"
              min="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Direct stock adjustment - will create a transaction record
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : '📝 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};