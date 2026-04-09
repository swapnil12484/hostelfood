import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import api from "../api/axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    attendancePercentage: 0,
    avgRating: 0,
    pendingComplaints: 0
  });
  const [todayMeals, setTodayMeals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [feedback, setFeedback] = useState({
    meal_slot_id: null,
    rating: 5,
    comment: ""
  });
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, mealsRes, annRes] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/meals/today"),
        api.get("/announcements")
      ]);

      setSummary(summaryRes.data.summary || { attendancePercentage: 0, avgRating: 0, pendingComplaints: 0 });
      setTodayMeals(Array.isArray(mealsRes.data) ? mealsRes.data : (mealsRes.data.meals || []));
      setAnnouncements(Array.isArray(annRes.data) ? annRes.data : (annRes.data.announcements || []));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = async (mealSlotId, status) => {
    try {
      const backendStatus = status === "YES" ? "attending" : "not_attending";
      await api.put(`/attendance/${mealSlotId}`, { status: backendStatus });
      
      setTodayMeals(prev => prev.map(meal => 
        meal.id === mealSlotId ? { ...meal, user_attendance_status: backendStatus } : meal
      ));
      
      const summaryRes = await api.get("/dashboard/summary");
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance. Please try again.");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.meal_slot_id) {
       setStatusMsg({ type: "error", text: "Please select a meal to rate." });
       return;
    }
    if (!feedback.comment.trim()) {
      setStatusMsg({ type: "error", text: "Please enter a comment." });
      return;
    }
    
    try {
      await api.post("/feedback", {
        meal_slot_id: feedback.meal_slot_id,
        rating: feedback.rating,
        comment: feedback.comment
      });
      
      setStatusMsg({ type: "success", text: "Feedback submitted successfully!" });
      setFeedback({ meal_slot_id: null, rating: 5, comment: "" });
      
      // Update local state to reflect the rating
      setTodayMeals(prev => prev.map(meal => 
        meal.id === feedback.meal_slot_id ? { ...meal, has_rated: true } : meal
      ));

      const summaryRes = await api.get("/dashboard/summary");
      if (summaryRes.data.summary) {
        setSummary(summaryRes.data.summary);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatusMsg({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to submit feedback." 
      });
    }
  };

  const activeTabName = "Home";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeTab={activeTabName} />

        <main className="flex-1 flex flex-col overflow-y-auto">
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold">{activeTabName}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4 hidden sm:block">
                <p className="text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
                <p className="text-xs text-slate-500">Mess Timing: Open</p>
              </div>
              <button 
                onClick={() => setNotifications(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {notifications && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Attendance Score</p>
                  <h3 className="text-2xl font-bold mt-1">{summary.attendancePercentage}%</h3>
                  <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${summary.attendancePercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-red-500">check_circle</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Your Avg. Rating</p>
                  <h3 className="text-2xl font-bold mt-1">{summary.avgRating}<span className="text-sm text-slate-400 font-normal">/5</span></h3>
                  <div className="flex gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`material-symbols-outlined text-sm filled-icon ${star <= Math.round(summary.avgRating) ? "text-yellow-400" : "text-slate-300"}`}>star</span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-600">
                  <span className="material-symbols-outlined text-yellow-400">star</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pending Complaints</p>
                  <h3 className="text-2xl font-bold mt-1">{summary.pendingComplaints < 10 ? `0${summary.pendingComplaints}` : summary.pendingComplaints}</h3>
                  <span className={`text-xs ${summary.pendingComplaints > 0 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"} px-2 py-1 rounded-full mt-2 inline-block font-medium`}>
                    {summary.pendingComplaints > 0 ? "Action Required" : "All Clear"}
                  </span>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-600">
                  <span className="material-symbols-outlined text-orange-400">pending_actions</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">restaurant_menu</span>
                      Today's Attendance & Menu
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {todayMeals.length === 0 ? (
                        <div className="col-span-3 py-12 text-center text-slate-500">
                          <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                          <p>No meals scheduled for today.</p>
                        </div>
                      ) : (
                        todayMeals.map((meal) => (
                          <div key={meal.id} className="space-y-4">
                            <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 relative group">
                              <img className="w-full h-full object-cover" alt={meal.meal_type} src={meal.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} />
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-bold">{meal.meal_type}</div>
                              {meal.has_rated ? (
                                <div className="absolute bottom-2 right-2 p-1.5 bg-emerald-500 rounded-lg text-white shadow-sm border border-emerald-600/20" title="Already Rated">
                                  <span className="material-symbols-outlined text-sm block">verified</span>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setFeedback(prev => ({ ...prev, meal_slot_id: meal.id }));
                                    setStatusMsg({ type: "", text: "" });
                                  }} 
                                  className="absolute bottom-2 right-2 p-1.5 bg-white rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                                  title="Rate this meal"
                                >
                                  <span className="material-symbols-outlined text-sm block">rate_review</span>
                                </button>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm truncate">{meal.menu_title}</h4>
                              <p className="text-xs text-slate-500">{meal.start_time.slice(0, 5)} - {meal.end_time.slice(0, 5)}</p>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                              <span className="text-xs font-medium">Attending?</span>
                              <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-md">
                                <button onClick={() => handleAttendanceChange(meal.id, "YES")} className={`px-3 py-1 text-[10px] font-bold rounded ${meal.user_attendance_status === "attending" ? "bg-primary text-white" : "text-slate-500"}`}>YES</button>
                                <button onClick={() => handleAttendanceChange(meal.id, "NO")} className={`px-3 py-1 text-[10px] font-bold rounded ${meal.user_attendance_status === "not_attending" ? "bg-red-500 text-white" : "text-slate-500"}`}>NO</button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>

                <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">campaign</span>
                      Recent Announcements
                    </h3>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {announcements.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm italic">No new announcements today.</div>
                    ) : (
                      announcements.map((ann) => (
                        <div key={ann.id} className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined">campaign</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold">{ann.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{ann.body}</p>
                            <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold">{new Date(ann.published_at).toLocaleDateString()} • {ann.source_label}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="font-bold text-lg mb-1">Rate Meal</h3>
                  {feedback.meal_slot_id ? (
                    <p className="text-xs text-primary font-bold uppercase mb-4">Rating: {todayMeals.find(m => m.id === feedback.meal_slot_id)?.meal_type}</p>
                  ) : (
                    <p className="text-xs text-slate-500 mb-4">Select a meal from today's menu to rate.</p>
                  )}
                  
                  {statusMsg.text && (
                    <div className={`text-[11px] font-bold p-3 rounded-lg mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300 ${
                      statusMsg.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        {statusMsg.type === 'success' ? 'check_circle' : 'error'}
                      </span>
                      {statusMsg.text}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={() => setFeedback(prev => ({ ...prev, rating: star }))} className={`material-symbols-outlined text-3xl cursor-pointer ${star <= feedback.rating ? "text-yellow-400" : "text-slate-200"}`}>star</span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <textarea value={feedback.comment} onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))} className="w-full rounded-lg border-slate-200 bg-slate-50 text-sm focus:ring-primary disabled:opacity-50" placeholder={feedback.meal_slot_id ? "Share your thoughts..." : "Select a meal first"} rows="3" disabled={!feedback.meal_slot_id}></textarea>
                    <button onClick={handleFeedbackSubmit} disabled={!feedback.meal_slot_id} className="w-full bg-primary text-white font-bold py-2.5 rounded-lg disabled:bg-slate-300">Submit Feedback</button>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      console.log("Meal History clicked");
                      alert("📅 Meal History: This feature is being prepared and will be available in the next update!");
                    }} 
                    className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center hover:bg-primary/10 hover:text-primary transition-all active:scale-95 group"
                  >
                    <span className="material-symbols-outlined block mb-1 group-hover:scale-110 transition-transform">history</span>
                    <span className="text-xs font-bold">Meal History</span>
                  </button>
                  <button 
                    onClick={() => {
                      console.log("Mess Bills clicked");
                      alert("💰 Mess Bills: Monthly statements are being generated. Please check back shortly!");
                    }} 
                    className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center hover:bg-primary/10 hover:text-primary transition-all active:scale-95 group"
                  >
                    <span className="material-symbols-outlined block mb-1 group-hover:scale-110 transition-transform">receipt_long</span>
                    <span className="text-xs font-bold">Mess Bills</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav activeTab={activeTabName} />
    </div>
  );
};

export default Dashboard;
