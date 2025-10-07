"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/"); // redirect to login if not signed in
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setUsername(profileData.username || "");
      }

      setLoading(false);
    };

    fetchUserAndProfile();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    setLoading(false);
    if (error) alert(error.message);
    else alert("Profile updated!");
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>

        <p className="mb-2 text-gray-700">
          <strong>Email:</strong> {user.email}
        </p>

        <p className="mb-4 text-gray-700">
          <strong>Points:</strong> {profile?.points ?? 0}
        </p>

        <label className="block text-gray-700 font-semibold mb-1">
          Username
        </label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-3"
        >
          {loading ? "Saving..." : "Save Changes"}
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