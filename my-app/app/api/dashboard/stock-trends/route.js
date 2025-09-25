import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    console.log('🔄 Fetching stock trends...');

    // Get stock trends for the last 30 days
    const stockTrendsResult = await query(`
      SELECT 
        DATE(created_at) as date,
        SUM(stock_quantity) as total_stock,
        COUNT(*) as products_count,
        AVG(stock_quantity) as avg_stock_per_product
      FROM Products 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    // Get low stock trend
    const lowStockTrendResult = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as low_stock_count
      FROM Products 
      WHERE stock_quantity <= 10 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    // Get stock by category
    const stockByCategoryResult = await query(`
      SELECT 
        c.name as category_name,
        SUM(p.stock_quantity) as total_stock,
        COUNT(p.product_id) as product_count
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      GROUP BY c.category_id, c.name
      ORDER BY total_stock DESC
    `);

    const stockTrends = {
      dailyTrends: stockTrendsResult.rows || [],
      lowStockTrends: lowStockTrendResult.rows || [],
      stockByCategory: stockByCategoryResult.rows || []
    };

    console.log('✅ Stock trends fetched successfully');

    return NextResponse.json({
      success: true,
      data: stockTrends
    });

  } catch (error) {
    console.error('❌ Stock trends error:', error);
    
    return NextResponse.json({
      success: true,
      data: {
        dailyTrends: [],
        lowStockTrends: [],
        stockByCategory: []
      },
      error: 'Database connection failed'
    });
  }
}