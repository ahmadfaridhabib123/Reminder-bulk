
export interface Meal {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  scheduledTime: string; // ISO string for the specific day
  actualTime?: string;   // ISO string when completed
  isCompleted: boolean;
  snoozeCount: number;
  order: number;
}

export interface UserProfile {
  id?: number;
  name: string;
  calorieGoal: number;
  proteinGoal: number;
  dailyReminderEnabled: boolean;
}

export interface DailyProgress {
  totalCalories: number;
  totalProtein: number;
  completedCalories: number;
  completedProtein: number;
}
