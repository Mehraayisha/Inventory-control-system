import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    console.log('🏢 Fetching suppliers from database...');
    
    const suppliersQuery = `
      SELECT 
        supplier_id,
        name as supplier_name,
        contact_email,
        contact_phone,
        address
      FROM Suppliers
      ORDER BY name ASC
    `;

    const result = await query(suppliersQuery);
    
    console.log('✅ Successfully fetched', result.rows.length, 'suppliers from database');
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('❌ Database error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers from database' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supplierData = await request.json();
    const { 
      supplier_name, 
      contact_person, 
      contact_email, 
      phone, 
      address, 
      city, 
      state, 
      zip_code, 
      country 
    } = supplierData;

    console.log('📝 Creating new supplier in database:', { supplier_name, contact_person, contact_email });

    // Validate required fields
    if (!supplier_name || !contact_email) {
      return NextResponse.json(
        { error: 'Supplier name and contact email are required' },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO Suppliers (
        supplier_name, 
        contact_person, 
        contact_email, 
        phone, 
        address, 
        city, 
        state, 
        zip_code, 
        country
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING supplier_id, supplier_name, contact_person, contact_email, phone, created_at
    `;

    const result = await query(insertQuery, [
      supplier_name,
      contact_person || '',
      contact_email,
      phone || '',
      address || '',
      city || '',
      state || '',
      zip_code || '',
      country || ''
    ]);

    const newSupplier = result.rows[0];

    console.log('✅ Supplier created successfully:', newSupplier.supplier_id);
    return NextResponse.json({
      message: 'Supplier created successfully',
      supplier: newSupplier
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Database error creating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}