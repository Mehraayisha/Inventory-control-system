import { query } from "../../../../lib/database";

export async function GET() {
  try {
    const res = await query(
      `SELECT p.product_id, p.name AS product_name, p.price, p.stock_quantity,
              c.category_name
       FROM Products p
       LEFT JOIN Categories c ON p.category_id = c.category_id
       ORDER BY p.product_id`
    );
    return new Response(JSON.stringify(res.rows), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
