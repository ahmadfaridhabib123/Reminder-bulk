
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<Props> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [name, setName] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setCalorieGoal(profile.calorieGoal.toString());
      setProteinGoal(profile.proteinGoal.toString());
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      onUpdate({
        ...profile,
        name: name || 'User',
        calorieGoal: parseInt(calorieGoal) || 3000,
        proteinGoal: parseInt(proteinGoal) || 180,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="glass w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Daily Calories</label>
              <input
                type="number"
                required
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Daily Protein (g)</label>
              <input
                type="number"
                required
                value={proteinGoal}
                onChange={(e) => setProteinGoal(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5722]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-all transform active:scale-95"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
