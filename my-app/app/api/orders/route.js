import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    console.log('📦 Fetching orders from database...');
    
    // Query to match your actual schema
    const ordersQuery = `
      SELECT 
        o.order_id,
        o.product_id,
        o.supplier_id,
        o.order_date,
        o.quantity_ordered,
        p.name as product_name,
        p.price as unit_price,
        s.name as supplier_name,
        s.contact_email,
        s.contact_phone
      FROM Orders o
      LEFT JOIN Products p ON o.product_id = p.product_id
      LEFT JOIN Suppliers s ON o.supplier_id = s.supplier_id
      ORDER BY o.order_date DESC
    `;

    const result = await query(ordersQuery);
    
    // Transform data to match frontend expectations
    const orders = result.rows.map(order => ({
      id: order.order_id,
      order_id: order.order_id,
      product_id: order.product_id,
      supplier_id: order.supplier_id,
      order_date: order.order_date?.toISOString().split('T')[0],
      quantity_ordered: order.quantity_ordered,
      product_name: order.product_name,
      unit_price: parseFloat(order.unit_price || 0),
      total_amount: (order.quantity_ordered * parseFloat(order.unit_price || 0)).toFixed(2),
      supplier_name: order.supplier_name,
      contact_email: order.contact_email,
      contact_phone: order.contact_phone,
      status: 'PENDING', // Default status since your table doesn't have this
      itemCount: 1, // Each order is one product
      items: [{
        product_id: order.product_id,
        product_name: order.product_name,
        quantity_ordered: order.quantity_ordered,
        unit_price: parseFloat(order.unit_price || 0),
        total_price: (order.quantity_ordered * parseFloat(order.unit_price || 0)).toFixed(2)
      }]
    }));

    console.log('✅ Successfully fetched', orders.length, 'orders from database');
    return NextResponse.json(orders);

  } catch (error) {
    console.error('❌ Database error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders from database', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('🔄 POST request received for order creation');
    
    const orderData = await request.json();
    console.log('📥 Received order data:', orderData);
    
    const { product_id, supplier_id, quantity_ordered } = orderData;

    console.log('📝 Creating new order in database:', { 
      product_id, 
      supplier_id, 
      quantity_ordered,
      types: {
        product_id: typeof product_id,
        supplier_id: typeof supplier_id,
        quantity_ordered: typeof quantity_ordered
      }
    });

    // Validate required fields
    if (!product_id || !supplier_id || !quantity_ordered) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { 
          error: 'product_id, supplier_id, and quantity_ordered are required',
          received: { product_id, supplier_id, quantity_ordered }
        },
        { status: 400 }
      );
    }

    // Validate that product and supplier exist
    try {
      console.log('🔍 Checking if product exists...');
      const productCheck = await query('SELECT product_id FROM Products WHERE product_id = $1', [product_id]);
      if (!productCheck.rows || productCheck.rows.length === 0) {
        return NextResponse.json(
          { error: `Product with ID ${product_id} does not exist` },
          { status: 400 }
        );
      }

      console.log('🔍 Checking if supplier exists...');
      const supplierCheck = await query('SELECT supplier_id FROM Suppliers WHERE supplier_id = $1', [supplier_id]);
      if (!supplierCheck.rows || supplierCheck.rows.length === 0) {
        return NextResponse.json(
          { error: `Supplier with ID ${supplier_id} does not exist` },
          { status: 400 }
        );
      }
    } catch (checkError) {
      console.error('❌ Error checking product/supplier existence:', checkError);
      return NextResponse.json(
        { error: 'Failed to validate product/supplier', details: checkError.message },
        { status: 500 }
      );
    }

    // Insert the order (matching your schema)
    const orderInsertQuery = `
      INSERT INTO Orders (product_id, supplier_id, quantity_ordered, order_date)
      VALUES ($1, $2, $3, NOW())
      RETURNING order_id, order_date, product_id, supplier_id, quantity_ordered
    `;

    console.log('💾 Executing insert query with values:', [product_id, supplier_id, quantity_ordered]);

    const result = await query(orderInsertQuery, [
      parseInt(product_id),
      parseInt(supplier_id),
      parseInt(quantity_ordered)
    ]);

    console.log('📊 Insert result:', result);

    if (!result.rows || result.rows.length === 0) {
      console.error('❌ No rows returned from insert');
      return NextResponse.json(
        { error: 'Failed to create order - no data returned' },
        { status: 500 }
      );
    }

    console.log('✅ Order created successfully:', result.rows[0]);
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Database error creating order:', error);
    console.error('❌ Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error.message,
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { order_id, quantity_ordered } = await request.json();

    console.log('📝 Updating order:', order_id);

    if (!order_id || !quantity_ordered) {
      return NextResponse.json(
        { error: 'order_id and quantity_ordered are required' },
        { status: 400 }
      );
    }

    const updateQuery = `
      UPDATE Orders 
      SET quantity_ordered = $1
      WHERE order_id = $2
      RETURNING order_id, quantity_ordered
    `;

    const result = await query(updateQuery, [quantity_ordered, order_id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order updated:', order_id);
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Database error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}