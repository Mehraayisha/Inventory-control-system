'use client';
import { useState, useEffect } from 'react';

export default function StockTrendChart() {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockTrends();
  }, []);

  const fetchStockTrends = async () => {
    try {
      const response = await fetch('/api/dashboard/stock-trends');
      const result = await response.json();
      if (result.success) {
        setStockData(result.data);
      }
    } catch (error) {
      console.error('Error fetching stock trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Get max value for chart scaling
  const maxStock = Math.max(...(stockData?.stockDistribution?.map(item => item.total_quantity) || [1]));

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-indigo-700">📊 Stock Overview & Distribution</h3>
      
      {stockData ? (
        <div className="space-y-6">
          {/* Stock Distribution Chart */}
          {stockData?.stockDistribution?.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Stock Level Distribution</h4>
              <div className="flex justify-between items-end h-40 space-x-2">
                {stockData.stockDistribution.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className={`rounded-t w-full min-h-[4px] ${
                        item.stock_level === 'Out of Stock' ? 'bg-gradient-to-t from-red-600 to-red-400' :
                        item.stock_level === 'Low Stock' ? 'bg-gradient-to-t from-orange-600 to-orange-400' :
                        item.stock_level === 'Medium Stock' ? 'bg-gradient-to-t from-yellow-600 to-yellow-400' :
                        'bg-gradient-to-t from-green-600 to-green-400'
                      }`}
                      style={{ 
                        height: `${maxStock > 0 ? (item.total_quantity / maxStock) * 120 : 4}px`,
                        maxHeight: '120px'
                      }}
                      title={`${item.stock_level}: ${item.product_count} products, ${item.total_quantity} units`}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 text-center">
                      {item.stock_level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.product_count} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview Stats Cards */}
          {stockData?.overview && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {stockData.overview.total_products || 0}
                </p>
                <p className="text-sm text-blue-800">Total Products</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {stockData.overview.total_stock || 0}
                </p>
                <p className="text-sm text-green-800">Total Stock</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {stockData.overview.low_stock_count || 0}
                </p>
                <p className="text-sm text-orange-800">Low Stock Items</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {stockData.overview.out_of_stock_count || 0}
                </p>
                <p className="text-sm text-red-800">Out of Stock</p>
              </div>
            </div>
          )}

          {/* Average Stock Info */}
          {stockData?.overview?.avg_stock_per_product && (
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-indigo-600">
                {Math.round(stockData.overview.avg_stock_per_product)}
              </p>
              <p className="text-sm text-indigo-800">Average Stock per Product</p>
            </div>
          )}

          {/* Category Breakdown */}
          {stockData.stockByCategory?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Stock by Category</h4>
              <div className="space-y-2">
                {stockData.stockByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-3">
                    <span className="font-medium">{category.category_name || 'Uncategorized'}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{category.product_count} products</span>
                      <span className="text-sm text-gray-600">
                        Avg: {Math.round(category.avg_stock_per_product || 0)}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                        {category.total_stock} units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No stock data available</p>
        </div>
      )}
    </div>
  );
}