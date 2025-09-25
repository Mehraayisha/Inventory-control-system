import { query } from "../../../../lib/database";

// GET all products
export async function GET() {
  try {
    const res = await query(
      `SELECT p.product_id, p.name AS product_name, p.price, p.stock_quantity,
              c.category_name, c.category_id
       FROM Products p
       LEFT JOIN Categories c ON p.category_id = c.category_id
       ORDER BY p.product_id`
    );
    return new Response(JSON.stringify(res.rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// POST new product
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, price, stock_quantity, category_id } = body;
    const res = await query(
      `INSERT INTO Products (name, price, stock_quantity, category_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, price, stock_quantity, category_id]
    );
    return new Response(JSON.stringify(res.rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// PUT update product
export async function PUT(req) {
  try {
    const body = await req.json();
    const { product_id, name, price, stock_quantity, category_id } = body;
    const res = await query(
      `UPDATE Products
       SET name=$1, price=$2, stock_quantity=$3, category_id=$4
       WHERE product_id=$5
       RETURNING *`,
      [name, price, stock_quantity, category_id, product_id]
    );
    return new Response(JSON.stringify(res.rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// DELETE product
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await query(`DELETE FROM Products WHERE product_id=$1`, [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
