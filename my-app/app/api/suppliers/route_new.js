import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    console.log('🏢 Fetching suppliers from database...');
    
    const suppliersQuery = `
      SELECT 
        supplier_id,
        supplier_name,
        contact_person,
        contact_email,
        phone,
        address,
        city,
        state,
        zip_code,
        country,
        created_at,
        updated_at
      FROM Suppliers
      ORDER BY supplier_name ASC
    `;

    const result = await query(suppliersQuery);
    
    console.log('✅ Successfully fetched', result.rows.length, 'suppliers from database');
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('❌ Database error fetching suppliers:', error);
    // If suppliers table doesn't exist, provide a simple fallback
    console.log('Providing fallback supplier data...');
    const fallbackSuppliers = [
      { supplier_id: 1, supplier_name: "Tech Supplies", contact_email: "tech@supplies.com", phone: "+1-555-0123" },
      { supplier_id: 2, supplier_name: "Office Essentials", contact_email: "office@essentials.com", phone: "+1-555-0456" },
      { supplier_id: 3, supplier_name: "Industrial Parts", contact_email: "parts@industrial.com", phone: "+1-555-0789" },
      { supplier_id: 4, supplier_name: "Fresh Foods", contact_email: "fresh@foods.com", phone: "+1-555-0321" }
    ];
    return NextResponse.json(fallbackSuppliers);
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