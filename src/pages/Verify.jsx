import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/verify?token=${token}`
      );
        login(res.data.token, res.data.gym);
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        {status === "verifying" && (
          <>
            <div className="text-5xl animate-pulse">⚡</div>
            <h2 className="text-white font-bold text-lg">Verifying your link...</h2>
            <p className="text-gray-400 text-sm">Just a second</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl">✅</div>
            <h2 className="text-white font-bold text-lg">You're in!</h2>
            <p className="text-gray-400 text-sm">Redirecting to your dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl">❌</div>
            <h2 className="text-white font-bold text-lg">Invalid or expired link</h2>
            <p className="text-gray-400 text-sm">This link has expired or already been used.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
            >
              Request a new link
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;