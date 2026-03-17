import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { name: "Home", icon: "home", path: "/dashboard" },
    { name: "Weekly Menu", icon: "restaurant_menu", path: "/menu" },
    { name: "My Feedback", icon: "chat_bubble", path: "/feedback" },
    { name: "Complaints", icon: "report", path: "/complaints" },
    { name: "Profile", icon: "person", path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex-col hidden lg:flex h-screen sticky top-0 flex-shrink-0 transition-all">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white/20 p-2 rounded-lg shadow-inner">
            <span className="material-symbols-outlined text-white text-2xl">restaurant</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">HostelFood</h1>
            <span className="text-xs text-white/60 uppercase tracking-widest font-medium">Student Portal</span>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              disabled={activeTab === item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 group ${
                activeTab === item.name
                  ? "bg-white/15 text-white shadow-sm scale-[1.02]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined transition-transform duration-300 group-hover:scale-110 ${activeTab === item.name ? "filled-icon scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className="tracking-tight">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/10 bg-black/5">
        <div className="flex items-center justify-between gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 shadow-sm border border-white/10 overflow-hidden">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{user?.full_name || "Student"}</p>
              <p className="text-[10px] text-white/50 flex items-center gap-1 font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[12px]">door_front</span>
                Room {user?.room_no || "N/A"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/20 rounded-xl text-white/60 hover:text-red-400 transition-all active:scale-90"
            title="Logout"
          >
            <span className="material-symbols-outlined font-bold">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
