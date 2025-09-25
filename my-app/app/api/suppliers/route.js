// app/api/suppliers/[id]/route.js

import { NextResponse } from 'next/server';
import { getPool } from '@/lib/database';

/**
 * GET handler to fetch all suppliers (Read).
 * Corresponds to: fetch("/api/suppliers", { method: "GET" })
 */
export async function GET() {
  try {
    const pool = getPool();
    console.log('Fetching suppliers from database...'); // Debug log

    const result = await pool.query(
      'SELECT supplier_id, name, contact_email, contact_phone, address FROM Suppliers ORDER BY supplier_id DESC'
    );

    console.log('Found suppliers:', result.rows.length); // Debug log
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { message: 'Failed to fetch suppliers', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new supplier (Create).
 * Corresponds to: fetch("/api/suppliers", { method: "POST", ... })
 */
export async function POST(request) {
  try {
    const { name, contact_email, contact_phone, address } = await request.json();

    // Validation
    if (!name) {
      return NextResponse.json(
        { message: 'Supplier name is required' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const result = await pool.query(
      'INSERT INTO Suppliers (name, contact_email, contact_phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, contact_email || null, contact_phone || null, address || null]
    );

    console.log('Created supplier:', result.rows[0]); // Debug log
    return NextResponse.json({
      message: 'Supplier created successfully',
      supplier: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { message: 'Failed to create supplier', error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT handler to update a supplier by ID (Update).
 * Corresponds to: fetch("/api/suppliers/${editingId}", { method: "PUT", ... })
 */
export async function PUT(request, { params }) {
  const pool = getPool();
  try {
    const supplierId = params.id;
    const { name, contact_email, contact_phone, address } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Supplier name is required' }, { status: 400 });
    }

    const sql = `
      UPDATE suppliers
      SET name = $1, contact_email = $2, contact_phone = $3, address = $4
      WHERE supplier_id = $5
      RETURNING *;
    `;
    const values = [name, contact_email || null, contact_phone || null, address || null, supplierId];

    const result = await pool.query(sql, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }

    // Return the updated supplier object
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error(`Error updating supplier ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to update supplier' }, { status: 500 });
  }
}

/**
 * DELETE handler to delete a supplier by ID (Delete).
 * Corresponds to: fetch("/api/suppliers/${id}", { method: "DELETE" })
 */
export async function DELETE(request, { params }) {
  const pool = getPool();
  try {
    const supplierId = params.id;

    const sql = 'DELETE FROM suppliers WHERE supplier_id = $1;';
    const result = await pool.query(sql, [supplierId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Supplier not found' }, { status: 404 });
    }

    // Return a success message
    return NextResponse.json({ message: 'Supplier deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting supplier ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to delete supplier' }, { status: 500 });
  }
}