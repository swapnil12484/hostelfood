import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import api from "../api/axios";

const WeeklyMenu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [weeklyMeals, setWeeklyMeals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchWeeklyMeals();
  }, []);

  const fetchWeeklyMeals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/meals/weekly");
      const meals = Array.isArray(response.data.meals) ? response.data.meals : (response.data || []);
      
      // Group meals by date
      const grouped = meals.reduce((acc, meal) => {
        const dateKey = new Date(meal.service_date).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(meal);
        return acc;
      }, {});
      
      setWeeklyMeals(grouped);
    } catch (error) {
      console.error("Error fetching weekly meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeTabName = "Weekly Menu";
  const todayStr = new Date().toDateString();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex">
      <Sidebar activeTab={activeTabName} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
          <h2 className="text-xl font-bold">Hostel Food Portal</h2>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-slate-500 tracking-wide">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <section className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
            <div>
              <h3 className="font-bold text-4xl tracking-tight text-primary">Savor the Week</h3>
              <p className="text-slate-500 mt-2 max-w-xl">A curated selection of seasonal flavors and nutritious meals designed for mindful consumption and student well-being.</p>
            </div>
            <button 
               onClick={() => alert("PDF download coming soon!")}
               className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">download</span>
              Download PDF Menu
            </button>
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
          ) : Object.keys(weeklyMeals).length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">restaurant</span>
               <p className="text-lg font-semibold">No menu scheduled for the next 7 days.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {Object.keys(weeklyMeals).sort((a, b) => new Date(a) - new Date(b)).map((dateKey, index) => {
                const date = new Date(dateKey);
                const isToday = dateKey === todayStr;
                const meals = weeklyMeals[dateKey];

                if (index === 0) {
                  // Current/First Day Hero Card
                  return (
                    <div key={dateKey} className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 relative group">
                      <div className="absolute top-0 right-0 p-4">
                        <span className={`px-3 py-1 ${isToday ? "bg-primary" : "bg-slate-500"} text-white text-[10px] font-bold uppercase tracking-widest rounded-full`}>
                          {isToday ? "Current Day" : "Up Next"}
                        </span>
                      </div>
                      <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                          <p className="text-sm uppercase tracking-widest text-slate-400 font-bold">{date.toLocaleDateString('en-US', { weekday: 'long' })}</p>
                          <h4 className="font-bold text-5xl">{date.getDate()}</h4>
                          <p className="font-medium text-slate-500">{date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                        </div>
                        
                        {meals.map((meal) => (
                          <div key={meal.id} className="flex flex-col gap-3">
                            <div className="h-28 w-full rounded-lg overflow-hidden relative group">
                              <img alt={meal.meal_type} className="w-full h-full object-cover transition-transform group-hover:scale-105" src={meal.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}/>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white uppercase tracking-wider">{meal.start_time.slice(0,5)} - {meal.end_time.slice(0,5)}</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-lg">{meal.meal_type}</h5>
                              <p className="text-xs text-slate-500">{meal.menu_title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={dateKey} className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-6 flex flex-col gap-4 shadow-sm border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                       {date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                    </p>
                    <div className="space-y-4 flex-1">
                      {meals.map((meal) => (
                        <div key={meal.id} className="border-l-2 border-primary/20 pl-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{meal.meal_type}</p>
                          <p className="text-sm font-semibold">{meal.menu_title}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => alert(`${dateKey} details coming soon!`)} className="w-full py-2 text-xs font-bold text-primary border border-primary/10 rounded-lg hover:bg-primary/5 transition-colors">View Details</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Nutritional Insight */}
          <div className="bg-primary/5 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center border border-primary/10">
            <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-slate-800 text-primary rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-3xl filled-icon">eco</span>
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h4 className="font-bold text-2xl text-slate-900 dark:text-white">Conscious Nutrition Weekly</h4>
              <p className="text-slate-500 opacity-90 max-w-2xl">This week's menu focuses on low-carbon ingredients. By choosing the vegetable options at least 3 times this week, you're contributing to a 15% reduction in our collective kitchen footprint.</p>
            </div>
            <button className="px-8 py-3 bg-white dark:bg-slate-800 text-primary border border-primary/20 rounded-full font-bold text-sm whitespace-nowrap hover:bg-primary/5 transition-colors shadow-sm">Learn More</button>
          </div>
        </section>

        <MobileNav activeTab={activeTabName} />
      </main>
    </div>
  );
};

export default WeeklyMenu;
