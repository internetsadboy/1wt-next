// app/api/count/route.ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

const DEFAULT_TZ = process.env.APP_TIMEZONE || "America/Los_Angeles";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = (searchParams.get("filter") || "").toLowerCase();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const tz = searchParams.get("tz") || DEFAULT_TZ;

  try {
    let result;

    if (start && end) {
      result = await sql`
        SELECT COUNT(*) FROM edit_log_entry
        WHERE entry_date BETWEEN ${start}::date AND ${end}::date
      `;
    } else {
      switch (filter) {
        case "day":
          result = await sql`
            SELECT COUNT(*) FROM edit_log_entry
            WHERE entry_date = (NOW() AT TIME ZONE ${tz})::date
          `;
          break;
        case "week":
          result = await sql`
            SELECT COUNT(*) FROM edit_log_entry
            WHERE DATE_TRUNC('week', entry_date::timestamp)
                  = DATE_TRUNC('week', (NOW() AT TIME ZONE ${tz}))
          `;
          break;
        case "month":
          result = await sql`
            SELECT COUNT(*) FROM edit_log_entry
            WHERE DATE_TRUNC('month', entry_date::timestamp)
                  = DATE_TRUNC('month', (NOW() AT TIME ZONE ${tz}))
          `;
          break;
        case "":
          result = await sql`SELECT COUNT(*) FROM edit_log_entry`;
          break;
        default:
          return NextResponse.json(
            { error: `Unknown filter "${filter}". Use day|week|month or start/end.` },
            { status: 400 }
          );
      }
    }

    const count = Number(result.rows[0].count);
    return NextResponse.json({ count });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch entry count" }, { status: 500 });
  }
}

