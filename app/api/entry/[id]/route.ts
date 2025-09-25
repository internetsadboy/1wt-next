export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const { rows } = await sql/*sql*/`
      SELECT 
        id, 
        entry_date, 
        (COUNT(*) OVER()) - ROW_NUMBER() OVER (ORDER BY entry_date DESC) + 1 AS countdown,
        start_minutes, 
        end_minutes, 
        hours, 
        notes, 
        created_at, 
        updated_at
      FROM edit_log_entry
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
