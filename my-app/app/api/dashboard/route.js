import { NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

export async function GET() {
  try {
    const pool = getPool();

    // Get total number of products
    const productsResult = await pool.query('SELECT COUNT(*) as total FROM products');
    const totalProducts = parseInt(productsResult.rows[0].total);

    // Get total number of suppliers
    const suppliersResult = await pool.query('SELECT COUNT(*) as total FROM suppliers');
    const totalSuppliers = parseInt(suppliersResult.rows[0].total);

    // Get total stock (sum of all product quantities)
    const totalStockResult = await pool.query('SELECT COALESCE(SUM(stock_quantity), 0) as total_stock FROM products');
    const totalStock = parseInt(totalStockResult.rows[0].total_stock);

    // Get low stock items (assuming low stock threshold is 10 or less)
    const lowStockResult = await pool.query('SELECT COUNT(*) as low_stock FROM products WHERE stock_quantity <= 10');
    const lowStockItems = parseInt(lowStockResult.rows[0].low_stock);

    // Get recent products (since Orders table might not exist yet)
    const recentProductsResult = await pool.query(`
      SELECT 
        product_id,
        name,
        stock_quantity,
        price
      FROM products
      ORDER BY product_id DESC
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalSuppliers,
        totalStock,
        lowStockItems,
        recentProducts: recentProductsResult.rows
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: 'Error fetching dashboard statistics' },
      { status: 500 }
    );
  }
}