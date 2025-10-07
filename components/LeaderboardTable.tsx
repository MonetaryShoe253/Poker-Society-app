"use client";

export default function LeaderboardTable({ players }: { players: any[] }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Rank</th>
          <th className="border p-2">Username</th>
          <th className="border p-2">Points</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, idx) => (
          <tr key={player.id} className="text-center">
            <td className="border p-2">{idx + 1}</td>
            <td className="border p-2">{player.username}</td>
            <td className="border p-2">{player.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
