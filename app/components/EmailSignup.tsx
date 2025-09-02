"use client";

import React from "react";

interface EmailSignupProps {
  apiUrl?: string; // optionally override API endpoint
}

export default function EmailSignup({ apiUrl = "https://api.onewaytix.film/submit" }: EmailSignupProps) {
  const [email, setEmail] = React.useState<string>("");
  const [hasError, setHasError] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const date: string = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Los_Angeles",
    });

    try {
      const res: Response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date, email:email }),
      });

      if (res.ok) {
        setStatus("You'll be notified when the film is released!");
        setEmail("");
        if (hasError) setHasError(false);
      } else {
        setHasError(true);
        let message = "Submission failed";
        try {
          const data = await res.json();
          if (data?.error) message = String(data.error);
        } catch {}
        setStatus(message);
      }
    } catch (err: unknown) {
      setHasError(true);
      setStatus(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 w-full max-w-lg bg-white">
      <h2 className="bg-white text-xl font-semibold mb-6">
        Get notified when the film is released!
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row w-full gap-4 text-lg"
        noValidate
      >
        <input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="Your email"
          autoComplete="email"
          required
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="flex-1 border-b border-gray-400 focus:outline-none px-2 py-2"
          aria-invalid={hasError || undefined}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white hover:cursor-pointer px-6 py-2 font-semibold border border-black rounded disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {status && (
        <p
          className={`mt-3 text-sm ${
            hasError ? "text-red-600" : "text-green-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {status}
        </p>
      )}
    </section>
  );
}
