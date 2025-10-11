"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.push("/profile"); // redirect if already logged in
    };
    checkUser();
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Signup successful! Check your email to confirm your account.");
      }
      router.push("/profile");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="mt-3 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
