import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

const MyFeedback = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get("/feedback/mine");
      setFeedbackList(response.data.feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeTabName = "My Feedback";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar activeTab={activeTabName} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold">My Feedback History</h2>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4 hidden sm:block">
                <p className="text-sm font-medium">Hello, {user?.full_name || "Student"}</p>
                <p className="text-xs text-slate-500">Room {user?.room_no || "N/A"}</p>
              </div>
            </div>
          </header>

          <div className="p-8 max-w-5xl mx-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">chat_bubble_outline</span>
                <p className="text-lg font-semibold">No feedback found</p>
                <p className="text-slate-500 mt-2">You haven't submitted any meal feedback yet.</p>
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Rate Today's Meal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((fb) => (
                  <div 
                    key={fb.id} 
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                          {fb.meal_type.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{fb.menu_title}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(fb.service_date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1.5 rounded-full">
                        <span className="text-yellow-600 font-bold">{fb.rating}</span>
                        <span className="material-symbols-outlined text-yellow-400 filled-icon text-lg">star</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg italic text-slate-700 dark:text-slate-300">
                      "{fb.comment}"
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Submitted on {new Date(fb.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <MobileNav activeTab={activeTabName} />
    </div>
  );
};

export default MyFeedback;
