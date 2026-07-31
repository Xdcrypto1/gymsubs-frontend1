import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://gymsubs-backend.onrender.com/api/auth/magic-link", { email });
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-red-500 font-black text-3xl">⚡</span>
          <h1 className="text-white text-2xl font-bold mt-2">GymSubs</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your dashboard</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-5">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📧</div>
              <h2 className="text-white font-bold text-lg">Check your email</h2>
              <p className="text-gray-400 text-sm">
                We sent a login link to{" "}
                <span className="text-white">{email}</span>.
                It expires in 15 minutes.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-red-500 hover:text-red-400 text-sm transition"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm">
                Enter your email and we'll send you a secure login link. No password needed.
              </p>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gym@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Login Link"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-red-500 hover:text-red-400 transition">
                  Register your gym
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;