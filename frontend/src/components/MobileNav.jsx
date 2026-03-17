import React from "react";
import { useNavigate } from "react-router-dom";

const MobileNav = ({ activeTab }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", icon: "home", path: "/dashboard" },
    { name: "Menu", icon: "restaurant_menu", path: "/menu" },
    { name: "Feedback", icon: "chat_bubble", path: "/feedback" },
    { name: "Complaints", icon: "report", path: "/complaints" }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 h-20 flex items-center justify-around px-4 z-[999] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {navItems.map((item) => {
        const isActive = activeTab === item.name || (item.name === "Home" && activeTab === "Dashboard");
        return (
          <button 
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 ${
              isActive ? "text-primary scale-110" : "text-slate-400 opacity-60 hover:opacity-100"
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? "filled-icon" : ""}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-0 scale-50"}`}>
              {item.name}
            </span>
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#FF4D4D]"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MobileNav;
