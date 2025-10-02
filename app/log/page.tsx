"use client";

import { useEffect, useState } from "react";

function formatTimeFromMinutes(m?: number) {
  if (typeof m !== "number" || Number.isNaN(m)) return "—";
  const hours = Math.floor(m / 60);
  const minutes = m % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function fmtDate(s?: string) {
  if (!s) return "—";
  // Handles "YYYY-MM-DD" or ISO strings
  const d = s.length <= 10 ? new Date(`${s}T00:00:00`) : new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

type Entry = {
  id: string;
  entry_date: string;
  countdown: number;
  start_minutes?: number;
  end_minutes?: number;
  notes?: string | null;
};

// used for hours analytics, top of page
type HoursData = {
  total: number;
  month: number;
  week: number;
  today: number;
};

export default function LogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoursData, setHoursData] = useState<HoursData | null>(null);
  const [lastUpdated, setLastUpdated] = useState("--");

  useEffect(() => {

    fetch("/api/hours")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setHoursData(data);
        console.log(`Fetched hours data: ${data}`);
      })
      .catch((e) => console.error("Failed to fetch hours:", e));

    // grab new entry value
    fetch("/api/count")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (typeof data.count === "number") {
          document.title = `LOG (#${data.count})`;
        }
        // add timestamp
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((e) => console.error("Failed to fetch count:", e));

    // grab entries
    fetch("/api/entry?limit=10&offset=0") // or /api/entries if that's your route
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        // Normalize to an array no matter what the API shape is
        const arr: unknown =
          Array.isArray(data) ? data :
          Array.isArray((data as any).rows) ? (data as any).rows :
          Array.isArray((data as any).items) ? (data as any).items :
          [];
        setEntries(arr as Entry[]);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-3xl sm:p-6 px-6 sm:px-16 pt-8 sm:pt-12">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  
  return (
    <main className="max-w-3xl sm:p-6 px-6 sm:px-16 pt-8 sm:pt-12">
      <div className="mb-4 flex flex-col gap-2 tracking-wide">
        <h1 className="text-5xl font-semibold ">LOG</h1>
        <div className="flex flex-col gap-1 tracking-[1px] mt-2">
          <p className="text-lg">
            <span className="font-bold black-bg">{hoursData ? hoursData.total : ''}</span>
            {' '}
            <span className="ml-1 underline uppercase underline-offset-4 decoration-1">
              Total hours
            </span> 
          </p>
          <p className="text-lg">
            <span className="font-bold black-bg">{hoursData ? hoursData.month : ''}</span>
            {' '}
            <span className="ml-1 underline uppercase underline-offset-4 decoration-1">
             Month
            </span>              
          </p>
          <p className="text-lg">
            <span className="font-bold black-bg">{hoursData ? hoursData.week : ''}</span>
            {' '}
            <span className="ml-1 underline uppercase underline-offset-4 decoration-1">
              Week
            </span>
          </p>
          <p className="text-lg">
            <span className="font-bold black-bg">{hoursData ? hoursData.today : ''}</span>
            {' '}
            <span className="ml-1 underline uppercase underline-offset-4 decoration-1">
              Today
            </span>
          </p>
        </div>
        <p>Digital tracking began on 9-27-25</p>
        <p className="text-sm">Last updated: {lastUpdated}</p>
      </div>
      <div className="border-gray-200">
        {entries.length === 0 ? (
            <div>
            <p className="py-6 text-center text-gray-500">
                No entries found.
            </p>
            </div>
        ) : (
            entries.map((e) => (
                <div key={e.id} className="flex flex-col gap-2 py-4">
                    <h1 className="text-3xl w-fit font-bold">#{e.countdown}</h1>
                    <p>
                        <span 
                            className="font-semibold text-lg mr-2">
                                {e.entry_date.split('T')[0].slice(5)}{" "}
                        </span>
                    </p>
                    <p className="max-w-[22rem]" title={e.notes ?? ""}>
                        {e.notes ?? "—"}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <span className="courier">{formatTimeFromMinutes(e.start_minutes)}{" "}</span>
                        <span className="courier">{formatTimeFromMinutes(e.end_minutes)}</span>
                    </div>
                </div>
            ))
        )}
      </div>
    </main>
  );
}