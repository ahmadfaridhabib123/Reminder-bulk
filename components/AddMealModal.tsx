
import React, { useState, useEffect } from 'react';
import { Meal } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (meal: Omit<Meal, 'id' | 'isCompleted' | 'snoozeCount' | 'order'>) => void;
  onUpdate?: (id: number, meal: Partial<Meal>) => void;
  initialMeal?: Meal | null;
}

const AddMealModal: React.FC<Props> = ({ isOpen, onClose, onAdd, onUpdate, initialMeal }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [time, setTime] = useState('08:00');

  useEffect(() => {
    if (initialMeal) {
      setName(initialMeal.name);
      setCalories(initialMeal.calories.toString());
      setProtein(initialMeal.protein.toString());
      const d = new Date(initialMeal.scheduledTime);
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${mins}`);
    } else {
      setName('');
      setCalories('');
      setProtein('');
      setTime('08:00');
    }
  }, [initialMeal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [hours, minutes] = time.split(':');
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const mealData = {
      name: name || 'Unnamed Meal',
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      scheduledTime: scheduledTime.toISOString(),
    };

    if (initialMeal && onUpdate && initialMeal.id) {
      onUpdate(initialMeal.id, mealData);
    } else {
      onAdd(mealData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">{initialMeal ? 'Edit Meal' : 'Add New Meal'}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Meal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Post-Workout Shake"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Calories</label>
              <input
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Protein (g)</label>
              <input
                type="number"
                required
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Scheduled Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722] transition-colors [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF5722]/20 transition-all transform active:scale-95 mt-4"
          >
            {initialMeal ? 'Update Meal' : 'Add to Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMealModal;
