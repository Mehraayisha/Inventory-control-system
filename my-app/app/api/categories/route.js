import { NextResponse } from 'next/server';
import { query } from '../../../lib/database.js';

export async function GET() {
  try {
    const categoriesQuery = `
      SELECT 
        category_id as id,
        category_name as name,
        description
      FROM 
        Categories
      ORDER BY 
        category_name ASC
    `;

    const result = await query(categoriesQuery);
    
    console.log(`Retrieved ${result.rows.length} categories from database`);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}