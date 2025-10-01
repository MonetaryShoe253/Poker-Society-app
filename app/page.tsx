"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Check your email for a magic login link!");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">Poker Society App</h1>

      <form onSubmit={handleLogin} className="space-y-4 w-64">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Send Magic Link
        </button>
      </form>

      <button
        onClick={() => router.push("/dashboard")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Go to Dashboard
      </button>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>

      {message && <p className="text-gray-700">{message}</p>}
    </div>
  );
}
