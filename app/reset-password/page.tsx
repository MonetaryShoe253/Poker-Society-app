"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) alert(error.message);
    else {
      alert("Password updated! You can now log in.");
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        className="w-full mb-4 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Update Password
      </button>
    </div>
  );
}
