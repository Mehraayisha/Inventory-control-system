import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    // Query to get all stock information with product details and categories
    const stockQuery = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        c.category_name,
        c.category_id,
        CASE 
          WHEN p.stock_quantity = 0 THEN 'Out of Stock'
          WHEN p.stock_quantity < 10 THEN 'Low Stock'
          ELSE 'In Stock'
        END as status,
        CURRENT_DATE as last_updated
      FROM 
        Products p
      LEFT JOIN 
        Categories c ON p.category_id = c.category_id
      ORDER BY 
        p.name ASC
    `;

    const result = await query(stockQuery);
    
    // Transform the data to match the frontend format
    const stockData = result.rows.map(row => ({
      id: row.product_id,
      productId: `P${String(row.product_id).padStart(3, '0')}`,
      name: row.name,
      description: row.description || '',
      category: row.category_name || 'Uncategorized',
      categoryId: row.category_id,
      unitPrice: parseFloat(row.price) || 0,
      currentStock: row.stock_quantity || 0,
      reorderLevel: 10, // Default reorder level - you might want to add this to your schema
      status: row.status,
      lastUpdated: new Date(row.last_updated).toISOString().split('T')[0]
    }));

    console.log(`✅ Retrieved ${stockData.length} products from database`);
    return NextResponse.json(stockData);

  } catch (error) {
    console.error('❌ Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    // Update product information
    const updateQuery = `
      UPDATE Products 
      SET 
        name = $1,
        description = $2,
        category_id = $3,
        price = $4,
        stock_quantity = $5
      WHERE 
        product_id = $6
      RETURNING *
    `;

    const values = [
      data.name,
      data.description,
      data.categoryId,
      data.unitPrice,
      data.currentStock,
      data.id
    ];

    const result = await query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Updated product ${data.id} successfully`);
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error.message },
      { status: 500 }
    );
  }
}