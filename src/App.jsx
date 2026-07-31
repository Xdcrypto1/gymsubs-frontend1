import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import AddMember from "./pages/AddMember";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Verify from "./pages/Verify";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <span className="text-red-500 font-black text-3xl animate-pulse">⚡</span>
      </div>
    );
  }

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route
          path="/"
          element={
            token ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddMember />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;