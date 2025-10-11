"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [newScore, setNewScore] = useState<number | string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!data && !error) {
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([{ id: userId, username: "", points: 0 }])
        .select()
        .maybeSingle();
      if (!insertError) data = newProfile;
    }

    return { data, error };
  };

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);

      const { data: profileData } = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
      }

      setLoading(false);
    };

    load();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Username updated!");
      const { data: updated } = await fetchProfile(user.id);
      if (updated) setProfile(updated);
    }
  };

  const handleSubmitScore = async () => {
    if (!user || !newScore) return;
    const scoreNum = Number(newScore);
    if (isNaN(scoreNum)) {
      alert("Please enter a valid number");
      return;
    }

    // Insert into scores table
    const { error: insertError } = await supabase.from("scores").insert([
      {
        user_id: user.id,
        score: scoreNum,
        message: message || null,
      },
    ]);

    if (insertError) {
      alert(insertError.message);
      return;
    }

    // Update total points in profile
    const updatedPoints = (profile?.points ?? 0) + scoreNum;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ points: updatedPoints })
      .eq("id", user.id);

    if (updateError) {
      alert(updateError.message);
    } else {
      alert("Score submitted!");
      const { data: updated } = await fetchProfile(user.id);
      if (updated) setProfile(updated);
      setNewScore("");
      setMessage("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>

        <p className="mb-2 text-gray-700">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Username:</strong> {profile?.username || "Not set"}
        </p>

        <p className="mb-4 text-gray-700">
          <strong>Total Points:</strong> {profile?.points ?? 0}
        </p>

        <label className="block text-gray-700 font-semibold mb-1">
          Update Username
        </label>
        <input
          type="text"
          className="w-full p-2 mb-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          onClick={handleUpdateProfile}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
        >
          Save Username
        </button>

        <hr className="my-3" />

        <label className="block text-gray-700 font-semibold mb-1">
          Add Score
        </label>
        <input
          type="number"
          className="w-full p-2 mb-3 border rounded"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          placeholder="Enter your score"
        />
        <input
          type="text"
          className="w-full p-2 mb-3 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a message (optional)"
        />
        <button
          onClick={handleSubmitScore}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-4"
        >
          Submit Score
        </button>

        <hr className="my-3" />

        <button
          onClick={() => router.push("/history")}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 mb-4"
        >
          View Session History
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
