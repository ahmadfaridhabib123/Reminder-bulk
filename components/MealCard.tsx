
import React from 'react';
import { Meal } from '../types';

interface Props {
  meal: Meal;
  isLast: boolean;
  onComplete: (id: number) => void;
  onSnooze: (id: number) => void;
  onDelete: (id: number) => void;
}

const MealCard: React.FC<Props> = ({ meal, isLast, onComplete, onSnooze, onDelete }) => {
  const scheduledTime = new Date(meal.scheduledTime);
  const timeStr = scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isPast = scheduledTime < new Date() && !meal.isCompleted;

  return (
    <div className="relative flex gap-6">
      {/* Timeline Connector */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 ${
          meal.isCompleted 
            ? 'bg-[#FF5722] border-[#FF5722]' 
            : isPast 
              ? 'bg-red-500 border-red-500' 
              : 'bg-slate-800 border-slate-700'
          } z-10 transition-colors duration-300 relative shadow-[0_0_10px_rgba(255,87,34,0.3)]`}>
          {isPast && !meal.isCompleted && (
             <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20"></div>
          )}
        </div>
        {!isLast && <div className={`w-0.5 h-full ${meal.isCompleted ? 'bg-[#FF5722]/40' : 'bg-slate-800'} -mt-1`}></div>}
      </div>

      <div className={`flex-1 glass p-5 rounded-2xl group transition-all duration-300 mb-8 ${
        meal.isCompleted 
          ? 'opacity-50 grayscale-[0.2]' 
          : isPast 
            ? 'border-red-500/30' 
            : 'hover:border-[#FF5722]/30'
        }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white group-hover:text-[#FF5722] transition-colors">{meal.name}</h3>
              {meal.snoozeCount > 0 && (
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 uppercase font-bold">
                  Snoozed {meal.snoozeCount}x
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-medium ${isPast ? 'text-red-400' : 'text-slate-400'}`}>
                {timeStr}
              </span>
              {isPast && !meal.isCompleted && (
                <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 font-bold uppercase">
                  Delayed
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!meal.isCompleted && (
              <>
                <button 
                  onClick={() => onSnooze(meal.id!)}
                  className="p-2 bg-slate-800/50 hover:bg-[#FF5722]/10 rounded-xl text-slate-400 hover:text-[#FF5722] transition-colors border border-transparent hover:border-[#FF5722]/20"
                  title="Snooze 15 min"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onComplete(meal.id!)}
                  className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#FF5722]/20 transition-all transform active:scale-95"
                >
                  Eat
                </button>
              </>
            )}
            <button 
              onClick={() => onDelete(meal.id!)}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Calories</p>
            <p className="text-sm font-bold text-white">{meal.calories} <span className="text-slate-500 font-normal">kcal</span></p>
          </div>
          <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Protein</p>
            <p className="text-sm font-bold text-[#38bdf8]">{meal.protein} <span className="text-slate-500 font-normal">g</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
