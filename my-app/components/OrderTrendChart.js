'use client';
import { useState, useEffect } from 'react';

export default function OrderTrendChart() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderTrends();
  }, []);

  const fetchOrderTrends = async () => {
    try {
      const response = await fetch('/api/dashboard/order-trends');
      const result = await response.json();
      if (result.success) {
        setOrderData(result.data);
      }
    } catch (error) {
      console.error('Error fetching order trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const maxOrders = Math.max(...(orderData?.dailyTrends?.map(item => item.total_orders) || [1]));
  const maxRevenue = Math.max(...(orderData?.dailyTrends?.map(item => item.total_revenue) || [1]));

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-green-700">📈 Order Trends (Last 30 Days)</h3>
      
      {orderData?.dailyTrends?.length > 0 ? (
        <div className="space-y-6">
          {/* Dual Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-green-600">● Orders</span>
              <span className="text-blue-600">● Revenue</span>
            </div>
            <div className="flex justify-between items-end h-40 space-x-1">
              {orderData.dailyTrends.slice(0, 10).reverse().map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  {/* Orders bar */}
                  <div 
                    className="bg-gradient-to-t from-green-600 to-green-400 rounded-t w-1/2 min-h-[4px] mr-1"
                    style={{ 
                      height: `${(item.total_orders / maxOrders) * 120}px`,
                      maxHeight: '120px'
                    }}
                    title={`Orders: ${item.total_orders}`}
                  ></div>
                  {/* Revenue bar */}
                  <div 
                    className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-1/2 min-h-[4px] ml-1 absolute right-0 bottom-6"
                    style={{ 
                      height: `${(item.total_revenue / maxRevenue) * 120}px`,
                      maxHeight: '120px'
                    }}
                    title={`Revenue: $${item.total_revenue}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {orderData.dailyTrends[0]?.total_orders || 0}
              </p>
              <p className="text-sm text-green-800">Today's Orders</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                ${Math.round(orderData.dailyTrends[0]?.total_revenue || 0)}
              </p>
              <p className="text-sm text-blue-800">Today's Revenue</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                ${Math.round(orderData.dailyTrends[0]?.avg_order_value || 0)}
              </p>
              <p className="text-sm text-purple-800">Avg Order Value</p>
            </div>
          </div>

          {/* Order Status Distribution */}
          {orderData.statusDistribution?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Order Status (Last 30 Days)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {orderData.statusDistribution.map((status, index) => {
                  const statusColors = {
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'processing': 'bg-blue-100 text-blue-800',
                    'completed': 'bg-green-100 text-green-800',
                    'cancelled': 'bg-red-100 text-red-800',
                    'shipped': 'bg-purple-100 text-purple-800'
                  };
                  
                  return (
                    <div key={index} className={`rounded-lg p-3 text-center ${statusColors[status.status] || 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-lg font-bold">{status.count}</p>
                      <p className="text-xs capitalize">{status.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No order data available</p>
        </div>
      )}
    </div>
  );
}