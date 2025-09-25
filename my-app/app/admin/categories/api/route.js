import { query } from "../../../../lib/database";

export async function GET() {
  try {
    const res = await query("SELECT * FROM Categories ORDER BY category_name");
    return new Response(JSON.stringify(res.rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch categories" }), { status: 500 });
  }
}
