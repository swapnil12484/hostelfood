import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import api from "../api/axios";

const Complaints = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ title: "", category: "Food Quality", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get("/complaints/mine");
      setComplaints(Array.isArray(response.data.complaints) ? response.data.complaints : (response.data || []));
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/complaints", newComplaint);
      setShowModal(false);
      setNewComplaint({ title: "", category: "Food Quality", description: "" });
      fetchComplaints();
    } catch (error) {
      alert("Failed to lodge complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category) => {
    const map = {
      "Food Quality": "restaurant",
      "Hygiene": "clean_hands",
      "Service": "support_agent",
      "Other": "list_alt"
    };
    return map[category] || "list_alt";
  };

  const activeTabName = "Complaints";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex">
      <Sidebar activeTab={activeTabName} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl font-extrabold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">list_alt</span>
              Complaint Tracking
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2 hidden sm:flex">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Today's Date</span>
              <span className="text-sm font-semibold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Lodge New Complaint
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-extrabold">Recent Tickets</h3>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary text-white">All</button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[100px_1fr_120px_150px_180px] items-center px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Category & Detail</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ticket ID</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Submitted</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase text-right">Actions</span>
            </div>

            {/* Complaint List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <div className="p-12 text-center">Loading your tickets...</div>
              ) : complaints.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic">No complaints lodged yet.</div>
              ) : complaints.map((complaint) => (
                <div key={complaint.id} className="group flex flex-col md:grid md:grid-cols-[100px_1fr_120px_150px_180px] md:items-start px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                  {/* Status */}
                  <div className="mb-2 md:mb-0">
                    {complaint.status === "pending" && <span className="material-symbols-outlined text-xl text-orange-500">hourglass_top</span>}
                    {complaint.status === "scheduled" && <span className="material-symbols-outlined text-outline text-xl text-slate-400">schedule</span>}
                    {complaint.status === "resolved" && <span className="material-symbols-outlined text-primary text-xl filled-icon">check_circle</span>}
                  </div>

                  {/* Category & Detail */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-lg">{getCategoryIcon(complaint.category)}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaint.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{complaint.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* ID & Date */}
                  <div className="flex justify-between items-center mt-3 md:mt-0 md:contents">
                    <span className="text-xs font-medium text-slate-500 md:px-0">
                      <span className="md:hidden font-bold mr-2 text-[10px] uppercase">ID:</span>
                      #{complaint.id}
                    </span>
                    <span className="text-xs font-medium text-slate-500 md:px-0">
                      <span className="md:hidden font-bold mr-2 text-[10px] uppercase">Date:</span>
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex md:justify-end gap-2 mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setSelectedComplaint(complaint)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:opacity-90 transition-all shadow-md active:scale-95"
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal for New Complaint */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] max-w-lg w-full p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold font-headline">Lodge Complaint</h3>
                <button onClick={() => setShowModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 transition-colors">close</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Category</label>
                  <select 
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800 outline-none focus:border-primary transition-colors"
                  >
                    <option>Food Quality</option>
                    <option>Hygiene</option>
                    <option>Service</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Title</label>
                  <input 
                    type="text" 
                    required
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                    placeholder="Brief summary (e.g., Cold food)"
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Description</label>
                  <textarea 
                    rows="4"
                    required
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    placeholder="Provide more details..."
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-800 outline-none focus:border-primary transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold transition-all hover:opacity-90 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT TICKET"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal for View Details */}
        {selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-2xl w-full p-10 space-y-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setSelectedComplaint(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    selectedComplaint.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    <span className="material-symbols-outlined text-3xl filled-icon">
                      {selectedComplaint.status === 'resolved' ? 'verified' : 'pending_actions'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Ticket Detail</h3>
                    <p className="text-xs font-bold text-primary">#{selectedComplaint.id} • {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md">{selectedComplaint.category}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        selectedComplaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                      }`}>{selectedComplaint.status}</span>
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{selectedComplaint.title}</h2>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Description</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all"
                  >
                    Close View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <MobileNav activeTab={activeTabName} />
      </main>
    </div>
  );
};

export default Complaints;
