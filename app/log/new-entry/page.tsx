"use client";

import React, {useState, useEffect} from "react";

export default function NewEntryPage() {
  const [startMinutes, setStartMinutes] = useState("");
  const [endMinutes, setEndMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [entryNumber, setEntryNumber] = useState(0);


  useEffect(() => {
    // grab for new entry value
    fetch("/api/count")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (typeof data.count === "number") {
          const count = data.count + 1;
          document.title = `LOG #${count}`;
          setEntryNumber(count);
        }
      })
      .catch((e) => console.error("Failed to fetch count:", e));
  }, []);
  // 15:13
  // 07:28
  // convert 07:28 to 7*60 + 28
  function timeToMinutes(time: string) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // these are mandatory fields
    if (!startMinutes || !endMinutes) {
      alert("Please fill in both start and end times.");
      return;
    }

    const payload = {
      start_minutes: timeToMinutes(startMinutes),
      end_minutes: timeToMinutes(endMinutes),
      notes,
      entry_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    };

    console.log(payload);

    const res = await fetch("/api/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      
      // Optionally reset form fields
      setStartMinutes("");
      setEndMinutes("");
      setNotes("");
      console.log("Entry created successfully");
      alert("Entry created successfully!");
    } else {
      console.error("Failed to create entry");
      const errorData = await res.json();
      alert(`Error: ${errorData.error || "Unknown error"}`);
    }
  }

  return (
    <main className="max-w-3xl p-6 px-16 pt-12">
      <form 
        className="flex flex-col w-fit gap-8 border-gray-200" 
        style={{width:500}} 
        onSubmit={handleSubmit}
      >
        <header className="tracking-wide">
          <h1 className="text-xl font-bold mb-2">New Log Entry <span className="font-normal px-1">[ {entryNumber} ]</span></h1>
          <h2>Date: {`${new Date().toLocaleDateString()}`}</h2>
        </header>
        <div className="flex flex-col flex gap-2">
          <label htmlFor="start_minutes">Start</label>
          <input 
            className="border border-gray-200 p-2" 
            type="time" 
            id="start_minutes" 
            name="start_minutes" 
            value={startMinutes}
            onChange={(e) => {
              console.log(`start: ${e.target.value}`);
              setStartMinutes(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col flex gap-2">
          <label htmlFor="end_minutes" id="end_minutes">Stop</label>
          <input 
            className="border border-gray-200 p-2" 
            type="time" 
            id="end_minutes" 
            name="end_minutes" 
            value={endMinutes}
            onChange={(e) => {
              console.log(`stop: ${e.target.value}`);
              setEndMinutes(e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col flex gap-2">
          <label htmlFor="notes" id="notes">Notes</label>
          <div className="text-sm">Characters {notes.length}</div>
          <textarea 
            className="p-2 border border-gray-200" 
            id="notes" 
            name="notes" 
            value={notes}
            onChange={(e) => {
              console.log(`notes: ${e.target.value}`);
              setNotes(e.target.value);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={false}
          className="bg-black text-white hover:cursor-pointer px-6 py-2 font-semibold border border-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {false ? "Submitting..." : "Submit"}
        </button>  
      </form>
      
    </main>
  )
}
