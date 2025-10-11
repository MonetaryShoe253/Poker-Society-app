"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, points")
        .order("points", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPlayers(data || []);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>

        {players.length === 0 ? (
          <p className="text-center text-gray-600">No players yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-200">
                <th className="p-2 text-left">Rank</th>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{player.username || "Anonymous"}</td>
                  <td className="p-2 text-right">{player.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
