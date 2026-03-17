import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import api from "../api/axios";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/me");
      const userData = response.data.user || response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeTabName = "Profile";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex font-body">
      <Sidebar activeTab={activeTabName} />

      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-extrabold tracking-tight font-headline">Hostel Food Portal</h1>
          <div className="flex items-center gap-6">
            <div className="text-sm font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto w-full space-y-10">
          {/* Hero Header Section */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <p className="text-primary font-bold text-sm tracking-[0.1em] uppercase mb-2">Student Profile</p>
              <h2 className="text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white font-headline">
                {user?.full_name || "Student"}
              </h2>
              <p className="text-slate-500 mt-4 text-lg max-w-xl">
                Manage your hostel dining experience, update preferences, and keep your contact information up-to-date.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-2xl transition-all group-hover:bg-primary/10"></div>
                <div className="w-40 h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl relative z-10 flex items-center justify-center editorial-shadow overflow-hidden">
                   <span className="material-symbols-outlined text-6xl text-slate-400">person</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Personal Details Card */}
            <div className="md:col-span-7 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] space-y-8 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2 font-headline">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary scale-75">badge</span>
                  </span>
                  Account Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Student ID</p>
                  <p className="font-medium text-slate-900 dark:text-white">HS-2023-{user?.id || "4482"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Hostel Block</p>
                  <p className="font-medium text-slate-900 dark:text-white">Main Block</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Room Number</p>
                  <p className="font-medium text-slate-900 dark:text-white">{user?.room_no || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Status</p>
                  <p className="font-medium text-slate-900 dark:text-white capitalize">{user?.role || "Student"}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-1">Email Address</p>
                  <p className="font-medium text-slate-900 dark:text-white">{user?.email || "student@university.edu"}</p>
                </div>
              </div>
            </div>

            {/* Dietary Preferences Card */}
            <div className="md:col-span-12 bg-slate-100 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-headline">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 scale-75">eco</span>
                </span>
                Dietary Preferences
              </h3>
              <p className="text-slate-500 mb-4 italic text-sm">Update your dietary preferences to help the kitchen staff better prepared.</p>
               <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm inline-block">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-3">Meal Type</p>
                  <div className="flex gap-3">
                    <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-bold transition-all">Non-Vegetarian</button>
                    <button className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Vegetarian</button>
                  </div>
                </div>
            </div>

            {/* Account Security Actions */}
            <div className="md:col-span-12 flex flex-col md:flex-row gap-4 items-center justify-between py-6">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <MobileNav activeTab={activeTabName} />

        <footer className="mt-auto py-8 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] opacity-50">
          Design System: The Conscious Steward • Version 1.0.4
        </footer>
      </main>
    </div>
  );
};

export default Profile;
