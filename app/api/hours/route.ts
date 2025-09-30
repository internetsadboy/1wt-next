export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(_req: Request) {
  try {
    const { rows } = await sql/*sql*/`
      SELECT 
        SUM(hours) AS total_hours
        FROM edit_log_entry
    `;
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
