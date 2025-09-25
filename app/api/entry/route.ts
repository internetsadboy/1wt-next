export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

function computeHours(start?: number, end?: number): number | null {
  if (start == null || end == null) return null;
  let diff = end - start;
  if (diff < 0) diff += 24 * 60; // handle cross-midnight
  return Math.round((diff / 60) * 100) / 100;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // pull raw values (no validation here)
    const entry_date = body.entry_date;
    const hours = body.hours ?? computeHours(body.start_minutes, body.end_minutes);
    const start = body.start_minutes ?? null;
    const end = body.end_minutes ?? null;
    const notes = body.notes ?? null;

    if (!entry_date || !hours || hours <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { rows } = await sql/*sql*/`
      INSERT INTO edit_log_entry (entry_date, start_minutes, end_minutes, hours, notes)
      VALUES (${entry_date}, ${start}, ${end}, ${hours}, ${notes})
      RETURNING id, entry_date, start_minutes, end_minutes, hours, notes, created_at, updated_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function encodeCursor(d: string, c: string, id: string) {
  return Buffer.from(`${d}|${c}|${id}`).toString("base64url");
}
function decodeCursor(cur: string) {
  const [d, c, id] = Buffer.from(cur, "base64url").toString().split("|");
  return { d, c, id };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get("limit") ?? "15");
    const cursor = searchParams.get("cursor") ?? null;

    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 15;

    // No cursor: just grab the first page
    if (!cursor) {
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
        ORDER BY entry_date DESC, created_at DESC, id DESC
        LIMIT ${limit + 1}
      `;
      const hasMore = rows.length > limit;
      const items = hasMore ? rows.slice(0, limit) : rows;
      const nextCursor = hasMore
        ? encodeCursor(items[items.length - 1].entry_date.toISOString().slice(0,10),
                       items[items.length - 1].created_at.toISOString(),
                       items[items.length - 1].id)
        : null;
      return NextResponse.json({ items, nextCursor, limit });
    }

    // With cursor: fetch where (entry_date, created_at, id) is "less" (newest→oldest)
    const { d, c, id } = decodeCursor(cursor);
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
      WHERE
        (entry_date, created_at, id) <
        (${d}::date, ${c}::timestamptz, ${id}::uuid)
      ORDER BY entry_date DESC, created_at DESC, id DESC
      LIMIT ${limit + 1}
    `;
    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore
      ? encodeCursor(items[items.length - 1].entry_date.toISOString().slice(0,10),
                     items[items.length - 1].created_at.toISOString(),
                     items[items.length - 1].id)
      : null;

    return NextResponse.json({ items, nextCursor, limit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}