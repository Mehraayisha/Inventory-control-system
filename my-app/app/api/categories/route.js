import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    const res = await query("SELECT * FROM Categories ORDER BY category_name");
    return NextResponse.json(res.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { category_name, description } = await request.json();
    
    if (!category_name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO Categories (category_name, description)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await query(insertQuery, [category_name, description]);
    
    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { category_id, category_name, description } = await request.json();
    
    if (!category_id || !category_name) {
      return NextResponse.json({ error: 'Category ID and name are required' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE Categories 
      SET category_name = $1, description = $2
      WHERE category_id = $3
      RETURNING *
    `;

    const result = await query(updateQuery, [category_name, description, category_id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('id');
    
    if (!category_id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Check if category is being used by any products
    const checkQuery = `SELECT COUNT(*) as count FROM Products WHERE category_id = $1`;
    const checkResult = await query(checkQuery, [category_id]);
    
    if (checkResult.rows[0].count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category. It is being used by products.' 
      }, { status: 400 });
    }

    const deleteQuery = `DELETE FROM Categories WHERE category_id = $1 RETURNING *`;
    const result = await query(deleteQuery, [category_id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      deletedCategory: result.rows[0]
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}