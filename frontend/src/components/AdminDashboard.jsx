import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Complaints");
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ complaints: [], attendance: [], feedbacks: [] });
  const [loading, setLoading] = useState(true);
  const [menuForm, setMenuForm] = useState({
    service_date: new Date().toISOString().split('T')[0],
    meal_type: "breakfast",
    menu_title: "",
    image_url: "",
    start_time: "07:30",
    end_time: "09:00",
    cutoff_time: "07:00"
  });
  const [submittingMenu, setSubmittingMenu] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [compRes, attRes, feedRes] = await Promise.all([
        api.get("/complaints/all"),
        api.get("/attendance/stats"),
        api.get("/feedback/all")
      ]);
      setData({
        complaints: compRes.data.complaints || [],
        attendance: attRes.data.stats || [],
        feedbacks: feedRes.data.feedback || []
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingMenu(true);
      await api.post("/meals", menuForm);
      alert("Menu item uploaded successfully!");
      setMenuForm({
        ...menuForm,
        menu_title: "",
        image_url: ""
      });
      // Refresh attendance stats if on that tab or just refresh all
      fetchAllData();
    } catch (error) {
      console.error("Error uploading menu:", error);
      alert(error.response?.data?.message || "Failed to upload menu item.");
    } finally {
      setSubmittingMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { name: "Complaints", icon: "report_problem" },
    { name: "Attendance", icon: "check_circle" },
    { name: "Feedbacks", icon: "chat_bubble" },
    { name: "Manage Menu", icon: "restaurant_menu" },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-primary text-white flex-col hidden lg:flex">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-white text-2xl">restaurant</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">HostelFood</h1>
              <span className="text-xs text-white/70 tracking-widest uppercase font-black opacity-50">Admin Portal</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${
                  activeTab === item.name
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`material-symbols-outlined ${activeTab === item.name ? "filled-icon" : ""}`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
          </nav>
          <div className="p-4 mt-auto border-t border-white/10">
            <div className="flex items-center justify-between gap-3 p-2 bg-black/10 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                   <span className="material-symbols-outlined text-white">person</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{user?.full_name || "Admin"}</p>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{user?.role || "Staff"}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined font-bold">logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-slate-900">
          <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-black font-headline tracking-tighter">{activeTab}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4 hidden sm:block">
                <p className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">System Operational</p>
              </div>
            </div>
          </header>

          <div className="p-10 max-w-7xl mx-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-10">
                {activeTab === "Complaints" && (
                  <section className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8">
                    <h3 className="font-bold text-xl mb-6">Recent Tickets</h3>
                    <div className="space-y-4">
                      {data.complaints.length === 0 ? (
                        <p className="italic text-slate-500">No complaints reported yet.</p>
                      ) : data.complaints.map(complaint => (
                        <div key={complaint.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100 dark:border-slate-800">
                           <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">{complaint.category}</span>
                               <p className="font-bold text-sm text-slate-900 dark:text-white">{complaint.user_name}</p>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{complaint.title}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">{new Date(complaint.created_at).toLocaleDateString()}</span>
                             <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${complaint.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                               {complaint.status}
                             </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === "Attendance" && (
                  <section className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.attendance.length === 0 ? (
                           <div className="col-span-3 p-12 text-center bg-slate-50 dark:bg-slate-800 rounded-[2rem]">No attendance data available for today.</div>
                        ) : data.attendance.map(item => (
                          <div key={item.meal_slot_id} className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[2rem]">
                              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">{item.meal_type} • {new Date(item.service_date).toLocaleDateString()}</p>
                              <p className="text-4xl font-black mb-1">{item.attending_count}<span className="text-slate-400 text-lg font-medium">/{item.total_students}</span></p>
                              <p className="text-xs text-slate-500 font-bold">{item.menu_title}</p>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {activeTab === "Feedbacks" && (
                  <section className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8">
                    <h3 className="font-bold text-xl mb-6">User Feedback</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.feedbacks.length === 0 ? (
                        <p className="italic text-slate-500 col-span-2">No feedback received for recent meals.</p>
                      ) : data.feedbacks.map(fb => (
                        <div key={fb.id} className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="font-black text-sm text-slate-900 dark:text-white">{fb.user_name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{fb.meal_type} • {fb.menu_title}</p>
                            </div>
                            <div className="flex gap-0.5">
                               {[1, 2, 3, 4, 5].map(s => (
                                 <span key={s} className={`material-symbols-outlined text-[14px] ${s <= fb.rating ? "text-yellow-400 filled-icon" : "text-slate-200"}`}>star</span>
                               ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">"{fb.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === "Manage Menu" && (
                  <section className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-10 max-w-2xl mx-auto shadow-xl">
                    <div className="text-center mb-8">
                       <span className="material-symbols-outlined text-4xl text-primary mb-2">add_circle</span>
                       <h3 className="font-black text-2xl">Upload New Menu Item</h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Populate the hostel dining schedule</p>
                    </div>
                    
                    <form onSubmit={handleMenuSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Service Date</label>
                          <input 
                            type="date" 
                            required 
                            className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                            value={menuForm.service_date}
                            onChange={e => setMenuForm({...menuForm, service_date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Meal Type</label>
                          <select 
                            className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                            value={menuForm.meal_type}
                            onChange={e => setMenuForm({...menuForm, meal_type: e.target.value})}
                          >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Menu Title</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Morning Harvest Pancakes"
                          className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                          value={menuForm.menu_title}
                          onChange={e => setMenuForm({...menuForm, menu_title: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Image URL (Optional)</label>
                        <input 
                          type="url" 
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                          value={menuForm.image_url}
                          onChange={e => setMenuForm({...menuForm, image_url: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Start Time</label>
                          <input 
                            type="time" 
                            required 
                            className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                            value={menuForm.start_time}
                            onChange={e => setMenuForm({...menuForm, start_time: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">End Time</label>
                          <input 
                            type="time" 
                            required 
                            className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                            value={menuForm.end_time}
                            onChange={e => setMenuForm({...menuForm, end_time: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Cutoff Time</label>
                          <input 
                            type="time" 
                            required 
                            className="w-full bg-white dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-sm h-12 focus:ring-primary focus:border-primary shadow-sm"
                            value={menuForm.cutoff_time}
                            onChange={e => setMenuForm({...menuForm, cutoff_time: e.target.value})}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={submittingMenu}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4 uppercase tracking-widest text-sm"
                      >
                        {submittingMenu ? "Uploading..." : "Publish Menu Item"}
                      </button>
                    </form>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
