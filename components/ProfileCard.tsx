"use client";

export default function ProfileCard({ profile }: { profile: any }) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">{profile.username}</h2>
      <p>Email: {profile.email}</p>
      <p>Points: {profile.points}</p>
    </div>
  );
}
