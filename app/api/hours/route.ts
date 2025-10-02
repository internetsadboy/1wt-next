import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    const { rows } = await sql/*sql*/`
      SELECT
        COALESCE(SUM(hours), 0) AS total,
        COALESCE(SUM(hours) FILTER (
          WHERE entry_date >= CURRENT_DATE - INTERVAL '30 days'
        ), 0) AS last_30_days,
        COALESCE(SUM(hours) FILTER (
          WHERE entry_date >= CURRENT_DATE - INTERVAL '7 days'
        ), 0) AS last_7_days,
        COALESCE(SUM(hours) FILTER (
            WHERE entry_date >= (now() AT TIME ZONE 'America/Los_Angeles')::date
        ), 0) AS since_local_midnight
      FROM edit_log_entry;
    `;

    const [r] = rows;

    const toNum = (v: string | number) => (typeof v === "string" ? Number(v) : v);

    return NextResponse.json({
      total: toNum(r.total),
      month: toNum(r.last_30_days),
      week: toNum(r.last_7_days),
      today: toNum(r.since_local_midnight),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
