
import React, { useState, useEffect } from 'react';
import { useMealLogic } from './hooks/useMealLogic';
import CircularProgressBar from './components/CircularProgressBar';
import MealCard from './components/MealCard';
import AddMealModal from './components/AddMealModal';
import ProfileModal from './components/ProfileModal';
import { initProfile, db } from './db';
import { UserProfile, Meal } from './types';
import { requestNotificationPermission } from './services/notifications';

const App: React.FC = () => {
  const { meals, progress, shiftSchedules, snoozeMeal, addMeal, updateMeal, deleteMeal } = useMealLogic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      await initProfile();
      const p = await db.profile.toCollection().first();
      if (p) setProfile(p);
      requestNotificationPermission();
    };
    loadProfile();
  }, []);

  const handleComplete = (id: number) => {
    shiftSchedules(id, new Date());
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleUpdateProfile = async (newProfile: UserProfile) => {
    if (newProfile.id) {
      await db.profile.update(newProfile.id, newProfile);
      setProfile(newProfile);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMeal(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 p-6 md:p-10 pb-32">
      <header className="max-w-4xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            REMINDER<span className="text-[#FF5722]">BULK</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">App by: bibboy</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Profile</p>
            <p className="text-sm font-semibold">{profile?.name || 'Loading...'}</p>
          </div>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center font-bold text-white shadow-lg hover:ring-2 ring-[#FF5722] ring-offset-2 ring-offset-[#020617] transition-all"
          >
            {profile?.name?.[0] || 'U'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Progress Section */}
        <section className="glass rounded-3xl p-8 mb-10 accent-glow">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#FF5722]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Daily Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center justify-items-center">
            <CircularProgressBar 
              label="Calories" 
              value={progress.completedCalories} 
              max={profile?.calorieGoal || 3000} 
              unit="total cal" 
              color="#FF5722" 
            />
            <CircularProgressBar 
              label="Protein" 
              value={progress.completedProtein} 
              max={profile?.proteinGoal || 180} 
              unit="grams" 
              color="#38bdf8" 
            />
          </div>
        </section>

        {/* Timeline Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Meal Schedule</h2>
            <div className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
              {meals.length} Planned Meals
            </div>
          </div>

          {meals.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <div className="bg-slate-800/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-300">No meals scheduled yet</h3>
              <p className="text-slate-500 text-sm mt-2 mb-6">Start your day by adding your first meal of the day.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-2 rounded-xl font-bold transition-all"
              >
                Add First Meal
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {meals.map((meal, index) => (
                <div key={meal.id} className="cursor-pointer" onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  handleEditMeal(meal);
                }}>
                  <MealCard 
                    meal={meal} 
                    isLast={index === meals.length - 1} 
                    onComplete={handleComplete}
                    onSnooze={snoozeMeal}
                    onDelete={deleteMeal}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 z-40 accent-glow"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Modals */}
      <AddMealModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAdd={addMeal}
        onUpdate={updateMeal}
        initialMeal={editingMeal}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
};

export default App;
