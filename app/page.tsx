"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      // Create profile automatically
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        username: user.email?.split("@")[0] ?? "user",
        points: 0,
      });
    }

    alert("Check your email to confirm your account before logging in.");
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/leaderboard");
  };

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Please enter your email to reset password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });
    setLoading(false);

    if (error) alert(error.message);
    else alert("Check your email for the password reset link.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {resetMode
            ? "Reset Password"
            : isLogin
            ? "Log In"
            : "Create an Account"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!resetMode && (
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {resetMode ? (
          <button
            onClick={handlePasswordReset}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        ) : isLogin ? (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        ) : (
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          {resetMode ? (
            <button
              onClick={() => setResetMode(false)}
              className="text-blue-600 hover:underline"
            >
              Back to login
            </button>
          ) : isLogin ? (
            <>
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
              <button
                onClick={() => setResetMode(true)}
                className="text-sm text-gray-500 hover:underline mt-2"
              >
                Forgot password?
              </button>
            </>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
