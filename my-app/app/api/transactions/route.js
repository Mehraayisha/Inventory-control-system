import { NextResponse } from 'next/server';
import { query, transaction } from '../../../lib/database.js';

export async function GET() {
  try {
    const transactionsQuery = `
      SELECT 
        st.transaction_id,
        st.product_id,
        p.name as product_name,
        st.transaction_type,
        st.quantity,
        st.transaction_date
      FROM 
        StockTransactions st
      JOIN 
        Products p ON st.product_id = p.product_id
      ORDER BY 
        st.transaction_date DESC
      LIMIT 100
    `;

    const result = await query(transactionsQuery);
    
    const transactions = result.rows.map(row => ({
      id: `T${String(row.transaction_id).padStart(3, '0')}`,
      productId: row.product_id,
      productName: row.product_name,
      type: row.transaction_type,
      quantity: row.quantity,
      date: new Date(row.transaction_date).toISOString().split('T')[0],
      user: 'System User'
    }));

    console.log(`Retrieved ${transactions.length} transactions from database`);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const result = await transaction(async (client) => {
      const insertTransactionQuery = `
        INSERT INTO StockTransactions (product_id, transaction_type, quantity, transaction_date)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      
      const transactionValues = [
        data.productId,
        data.transactionType,
        data.quantity
      ];
      
      const transactionResult = await client.query(insertTransactionQuery, transactionValues);
      
      let updateStockQuery;
      if (data.transactionType === 'IN') {
        updateStockQuery = `
          UPDATE Products 
          SET stock_quantity = stock_quantity + $1
          WHERE product_id = $2
          RETURNING *
        `;
      } else {
        updateStockQuery = `
          UPDATE Products 
          SET stock_quantity = GREATEST(0, stock_quantity - $1)
          WHERE product_id = $2
          RETURNING *
        `;
      }
      
      const stockValues = [data.quantity, data.productId];
      const stockResult = await client.query(updateStockQuery, stockValues);
      
      if (stockResult.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      return {
        transaction: transactionResult.rows[0],
        product: stockResult.rows[0]
      };
    });

    console.log(`Created stock transaction: ${data.transactionType} ${data.quantity} units for product ${data.productId}`);
    return NextResponse.json({ 
      success: true, 
      message: 'Stock transaction completed successfully',
      transaction: result.transaction,
      updatedProduct: result.product
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}