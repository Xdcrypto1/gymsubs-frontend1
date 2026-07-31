import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const plans = [
  { label: "Basic - ₦10,000", value: "Basic", amount: 10000 },
  { label: "Standard - ₦15,000", value: "Standard", amount: 15000 },
  { label: "Premium - ₦40,000", value: "Premium", amount: 40000 },
];

const AddMember = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "Basic",
    amount: 10000,
    payment_method: "cash",
    payment_reference: "",
    whatsapp: "",
  });
  const [loading, setLoading] = useState(false);

  const handlePlanChange = (e) => {
    const selected = plans.find((p) => p.value === e.target.value);
    setForm({ ...form, plan: selected.value, amount: selected.amount });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/members", form);
      toast.success("Member added successfully");
      setForm({
        name: "",
        email: "",
        plan: "Basic",
        amount: 10000,
        payment_method: "cash",
        payment_reference: "",
      });
    } catch (error) {
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Add New Member</h1>
        <p className="text-gray-400 text-sm mb-8">
          Manually add a member who paid cash or used another payment method
        </p>

        <div className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
        <label className="block text-sm text-gray-400 mb-1">
          WhatsApp Number <span className="text-gray-600">(optional)</span>
        </label>
        <input
          type="tel"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          placeholder="e.g. 08012345678"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Membership Plan</label>
            <select
              value={form.plan}
              onChange={handlePlanChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {plans.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="paystack">Paystack</option>
              <option value="renewal">Renewal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Payment Reference{" "}
              <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              value={form.payment_reference}
              onChange={(e) => setForm({ ...form, payment_reference: e.target.value })}
              placeholder="e.g. receipt number or transfer ref"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;