"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function HistoryPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("scores")
        .select("score, message, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setScores(data);
      }
    };

    loadHistory();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Session History</h1>

        {scores.length === 0 ? (
          <p className="text-gray-600 text-center">
            No scores submitted yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {scores.map((entry, i) => (
              <li
                key={i}
                className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100"
              >
                <p>
                  <strong>Score:</strong> {entry.score}
                </p>
                {entry.message && (
                  <p className="text-gray-700">
                    <strong>Message:</strong> {entry.message}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => router.push("/profile")}
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}
