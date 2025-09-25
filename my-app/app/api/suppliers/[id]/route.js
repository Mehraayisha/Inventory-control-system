import { NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

/**
 * GET handler to fetch a single supplier by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const pool = getPool();
    
    const result = await pool.query(
      'SELECT * FROM Suppliers WHERE supplier_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Supplier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    return NextResponse.json(
      { message: 'Failed to fetch supplier' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler to update a supplier by ID (Update).
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, contact_email, contact_phone, address } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Supplier name is required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if supplier exists
    const existingSupplier = await pool.query(
      'SELECT supplier_id FROM Suppliers WHERE supplier_id = $1',
      [id]
    );

    if (existingSupplier.rows.length === 0) {
      return NextResponse.json(
        { message: 'Supplier not found' },
        { status: 404 }
      );
    }

    // Update supplier
    const result = await pool.query(
      'UPDATE Suppliers SET name = $1, contact_email = $2, contact_phone = $3, address = $4 WHERE supplier_id = $5 RETURNING *',
      [name, contact_email || null, contact_phone || null, address || null, id]
    );

    return NextResponse.json({
      message: 'Supplier updated successfully',
      supplier: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { message: 'Failed to update supplier' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to delete a supplier by ID (Delete).
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const pool = getPool();

    // Check if supplier exists
    const existingSupplier = await pool.query(
      'SELECT supplier_id FROM Suppliers WHERE supplier_id = $1',
      [id]
    );

    if (existingSupplier.rows.length === 0) {
      return NextResponse.json(
        { message: 'Supplier not found' },
        { status: 404 }
      );
    }

    // Delete supplier
    const result = await pool.query(
      'DELETE FROM Suppliers WHERE supplier_id = $1',
      [id]
    );

    return NextResponse.json({
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json(
      { message: 'Failed to delete supplier' },
      { status: 500 }
    );
  }
}