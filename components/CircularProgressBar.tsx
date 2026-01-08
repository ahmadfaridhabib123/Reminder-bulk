
import React from 'react';

interface Props {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}

const CircularProgressBar: React.FC<Props> = ({ value, max, label, unit, color, size = 160 }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight">{Math.round(value)}</span>
          <span className="text-[10px] uppercase text-slate-400 font-medium">{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold text-slate-300">{label}</span>
      <span className="text-xs text-slate-500">Goal: {max}</span>
    </div>
  );
};

export default CircularProgressBar;
