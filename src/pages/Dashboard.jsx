import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const formatNaira = (amount) => {
  return `₦${Number(amount).toLocaleString()}`;
};

const daysLeft = (expiry_date) => {
  const today = new Date();
  const expiry = new Date(expiry_date);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
};

const statusColor = (status) => {
  if (status === "active") return "bg-green-500/10 text-green-400 border border-green-500/20";
  if (status === "expired") return "bg-red-500/10 text-red-400 border border-red-500/20";
  return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
};

// WhatsApp Modal
const WhatsAppModal = ({ links, onClose }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white text-lg">📲 Send Reminders</h2>
            <p className="text-gray-500 text-sm">{links.length} member{links.length !== 1 ? "s" : ""} expiring this week</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="divide-y divide-gray-800 max-h-96 overflow-y-auto">
          {links.map((link, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between gap-4">
              <p className="font-medium text-white truncate">{link.name}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-xl font-semibold transition whitespace-nowrap"
              >
                Open WhatsApp
              </a>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [remindingAll, setRemindingAll] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(null); // { links: [...] }

  const fetchData = async () => {
    try {
      const [statsRes, membersRes] = await Promise.all([
        api.get("/members/stats"),
        api.get("/members"),
      ]);
      setStats(statsRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (member) => {
    setSendingReminder(member.id);
    try {
      const res = await api.post(`/members/${member.id}/remind`);
      if (res.data.whatsappUrl) {
        // Show modal with single link
        setWhatsappModal({ links: [{ name: member.name, url: res.data.whatsappUrl }] });
      } else {
        toast.success(`Email reminder sent to ${member.name}`);
      }
    } catch (error) {
      toast.error("Failed to send reminder");
    } finally {
      setSendingReminder(null);
    }
  };

  const handleRemindAll = async () => {
    setRemindingAll(true);
    try {
      const res = await api.post("/members/remind-all");
      if (res.data.whatsappLinks?.length > 0) {
        setWhatsappModal({ links: res.data.whatsappLinks });
      } else {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to send reminders");
    } finally {
      setRemindingAll(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/members/${id}`, { status });
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/members/${id}`);
      toast.success("Member removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* WhatsApp Modal */}
      {whatsappModal && (
        <WhatsAppModal
          links={whatsappModal.links}
          onClose={() => setWhatsappModal(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-10">

        {/* Revenue at risk — hero section */}
        <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-6 mb-6">
          <p className="text-red-400 text-sm font-medium mb-1">⚠️ Revenue at risk this week</p>
          <p className="text-4xl md:text-5xl font-black text-white">
            {formatNaira(stats?.revenueAtRisk || 0)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {stats?.expiringThisWeek?.length || 0} member{stats?.expiringThisWeek?.length !== 1 ? "s" : ""} expiring in the next 7 days
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">Active Members</p>
            <p className="text-3xl font-black text-green-400">{stats?.totalActive || 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">Lost This Month</p>
            <p className="text-3xl font-black text-red-400">
              {formatNaira(stats?.revenueLost || 0)}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 col-span-2 md:col-span-1">
            <p className="text-gray-400 text-xs mb-1">Recovery Rate</p>
            <p className="text-3xl font-black text-yellow-400">{stats?.recoveryRate || 0}%</p>
          </div>
        </div>

        {/* Expiring this week */}
        {stats?.expiringThisWeek?.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl mb-8">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="font-bold text-lg">⚡ Expiring This Week</h2>
              <p className="text-gray-500 text-sm">Send reminders to recover this revenue</p>
            </div>

            <div className="divide-y divide-gray-800">
              {stats.expiringThisWeek.map((member) => {
                const days = daysLeft(member.expiry_date);
                return (
                  <div
                    key={member.id}
                    className="px-6 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <p className="text-gray-500 text-sm truncate">{member.email}</p>
                      <p className="text-xs mt-1">
                        <span className={`font-bold ${days <= 3 ? "text-red-400" : "text-yellow-400"}`}>
                          {days === 0 ? "Expires today" : `${days} day${days !== 1 ? "s" : ""} left`}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {member.plan} · {formatNaira(member.amount)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleSendReminder(member)}
                      disabled={sendingReminder === member.id}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-semibold transition disabled:opacity-50 whitespace-nowrap"
                    >
                      {sendingReminder === member.id ? "Loading..." : "Send Reminder"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-gray-800">
              <button
                onClick={handleRemindAll}
                disabled={remindingAll}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                {remindingAll ? "Loading..." : `📲 Send Reminder to All ${stats.expiringThisWeek.length} Members`}
              </button>
            </div>
          </div>
        )}

        {/* Full members table — desktop only */}
        <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-lg">All Members</h2>
            <span className="text-gray-500 text-sm">{members.length} total</span>
          </div>

          {members.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No members yet. Add your first one.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b border-gray-800">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Expires</th>
                  <th className="px-6 py-3">Days Left</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const days = daysLeft(member.expiry_date);
                  return (
                    <tr
                      key={member.id}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{member.name}</td>
                      <td className="px-6 py-4 text-gray-400">{member.email}</td>
                      <td className="px-6 py-4">{member.plan}</td>
                      <td className="px-6 py-4 capitalize text-gray-400">
                        {member.payment_method}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(member.expiry_date).toDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${days <= 7 ? "text-red-400" : "text-green-400"}`}>
                          {days > 0 ? `${days}d` : "Expired"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {member.status === "active" ? (
                            <button
                              onClick={() => handleStatusChange(member.id, "expired")}
                              className="text-yellow-400 hover:text-yellow-300 text-xs transition"
                            >
                              Mark Expired
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(member.id, "active")}
                              className="text-green-400 hover:text-green-300 text-xs transition"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-red-400 hover:text-red-300 text-xs transition"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile message for full table */}
        <div className="md:hidden bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm">
            📊 Open on a computer to see the full members table
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
