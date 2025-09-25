import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    console.log('🔄 Fetching order trends...');

    // Get order trends for the last 30 days
    const orderTrendsResult = await query(`
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value
      FROM Orders 
      WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(order_date)
      ORDER BY date DESC
      LIMIT 30
    `);

    // Get monthly comparison
    const monthlyComparisonResult = await query(`
      SELECT 
        MONTH(order_date) as month,
        YEAR(order_date) as year,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM Orders 
      WHERE order_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY YEAR(order_date), MONTH(order_date)
      ORDER BY year DESC, month DESC
      LIMIT 12
    `);

    // Get order status distribution
    const orderStatusResult = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM Orders
      WHERE order_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY status
    `);

    const orderTrends = {
      dailyTrends: orderTrendsResult.rows || [],
      monthlyComparison: monthlyComparisonResult.rows || [],
      statusDistribution: orderStatusResult.rows || []
    };

    console.log('✅ Order trends fetched successfully');

    return NextResponse.json({
      success: true,
      data: orderTrends
    });

  } catch (error) {
    console.error('❌ Order trends error:', error);
    
    return NextResponse.json({
      success: true,
      data: {
        dailyTrends: [],
        monthlyComparison: [],
        statusDistribution: []
      },
      error: 'Database connection failed'
    });
  }
}