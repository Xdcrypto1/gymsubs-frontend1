import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ gym_name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!form.gym_name || !form.email) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://gymsubs-backend.onrender.com/api/auth/register", form);
      setSent(true);
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
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
          <p className="text-gray-400 text-sm mt-1">Register your gym</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-5">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">📧</div>
              <h2 className="text-white font-bold text-lg">Check your email</h2>
              <p className="text-gray-400 text-sm">
                We sent a login link to{" "}
                <span className="text-white">{form.email}</span>.
                Click it to access your dashboard.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Gym Name</label>
                <input
                  type="text"
                  value={form.gym_name}
                  onChange={(e) => setForm({ ...form, gym_name: e.target.value })}
                  placeholder="EliteFit Gym"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="gym@example.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Register Gym"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-red-500 hover:text-red-400 transition">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;