"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [chips, setChips] = useState<number | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [chipsChange, setChipsChange] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  // Get current user on load
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();
  }, []);

  // Fetch total + recent sessions
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: totalData } = await supabase
        .from("sessions")
        .select("chips_change")
        .eq("user_id", user.id);

      if (totalData) {
        const total = totalData.reduce(
          (sum, s: any) => sum + s.chips_change,
          0
        );
        setChips(total);
      }

      const { data: sessionData } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setSessions(sessionData || []);
    };

    fetchData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase.from("sessions").insert([
      {
        user_id: user.id,
        chips_change: chipsChange,
        notes: notes,
      },
    ]);

    if (error) {
      alert("Error saving session: " + error.message);
    } else {
      setChipsChange(0);
      setNotes("");
      window.location.reload(); // quick refresh for now
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Not logged in</h1>
        <p>Please log in from the homepage.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {user.email}</h1>

      <div className="bg-gray-100 p-4 rounded-xl">
        <h2 className="text-lg font-semibold">Total Chips: {chips ?? 0}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          value={chipsChange}
          onChange={(e) => setChipsChange(Number(e.target.value))}
          placeholder="Chips won/lost"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Log Session
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Sessions</h2>
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li key={s.id} className="border p-2 rounded">
              {s.chips_change} chips ({s.notes || "No notes"})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
