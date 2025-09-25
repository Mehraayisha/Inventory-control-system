import { NextResponse } from 'next/server';
import { query } from '../../../../lib/database.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const categoryQuery = `
      SELECT * FROM Categories WHERE category_id = $1
    `;

    const result = await query(categoryQuery, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { category_name, description } = await request.json();
    
    if (!category_name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE Categories 
      SET category_name = $1, description = $2
      WHERE category_id = $3
      RETURNING *
    `;

    const result = await query(updateQuery, [category_name, description, id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if category is being used by any products
    const checkQuery = `SELECT COUNT(*) as count FROM Products WHERE category_id = $1`;
    const checkResult = await query(checkQuery, [id]);
    
    if (checkResult.rows[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category. It is being used by products.' },
        { status: 400 }
      );
    }

    const deleteQuery = `DELETE FROM Categories WHERE category_id = $1 RETURNING *`;
    const result = await query(deleteQuery, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      deletedCategory: result.rows[0]
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', details: error.message },
      { status: 500 }
    );
  }
}