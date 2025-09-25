import { NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET() {
  try {
    console.log('🔄 Fetching stock trends...');

    // Get current stock overview (since we don't have created_at in Products table)
    const stockOverviewResult = await query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(stock_quantity) as total_stock,
        AVG(stock_quantity) as avg_stock_per_product,
        COUNT(CASE WHEN stock_quantity <= 10 THEN 1 END) as low_stock_count,
        COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock_count
      FROM Products
    `);

    // Get stock levels distribution
    const stockDistributionResult = await query(`
       SELECT 
        CASE 
          WHEN stock_quantity = 0 THEN 'Out of Stock'
          WHEN stock_quantity <= 10 THEN 'Low Stock'
          WHEN stock_quantity <= 50 THEN 'Medium Stock'
          ELSE 'High Stock'
        END as stock_level,
        COUNT(*) as product_count,
        SUM(stock_quantity) as total_quantity
      FROM Products
      GROUP BY 
        CASE 
          WHEN stock_quantity = 0 THEN 'Out of Stock'
          WHEN stock_quantity <= 10 THEN 'Low Stock'
          WHEN stock_quantity <= 50 THEN 'Medium Stock'
          ELSE 'High Stock'
        END
      ORDER BY 
        CASE 
          WHEN (CASE 
            WHEN stock_quantity = 0 THEN 'Out of Stock'
            WHEN stock_quantity <= 10 THEN 'Low Stock'
            WHEN stock_quantity <= 50 THEN 'Medium Stock'
            ELSE 'High Stock'
          END) = 'Out of Stock' THEN 1
          WHEN (CASE 
            WHEN stock_quantity = 0 THEN 'Out of Stock'
            WHEN stock_quantity <= 10 THEN 'Low Stock'
            WHEN stock_quantity <= 50 THEN 'Medium Stock'
            ELSE 'High Stock'
          END) = 'Low Stock' THEN 2
          WHEN (CASE 
            WHEN stock_quantity = 0 THEN 'Out of Stock'
            WHEN stock_quantity <= 10 THEN 'Low Stock'
            WHEN stock_quantity <= 50 THEN 'Medium Stock'
            ELSE 'High Stock'
          END) = 'Medium Stock' THEN 3
          ELSE 4
        END
    
    `);

    // Get stock by category
    const stockByCategoryResult = await query(`
      SELECT 
        c.category_name as category_name,
        SUM(p.stock_quantity) as total_stock,
        COUNT(p.product_id) as product_count,
        AVG(p.stock_quantity) as avg_stock_per_product
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
      GROUP BY c.category_id, c.category_name
      ORDER BY total_stock DESC
    `);

    const stockTrends = {
      overview: stockOverviewResult.rows?.[0] || {},
      stockDistribution: stockDistributionResult.rows || [],
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
        overview: {},
        stockDistribution: [],
        stockByCategory: []
      },
      error: 'Database connection failed'
    });
  }
}