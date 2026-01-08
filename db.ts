import Dexie, { Table } from 'dexie';
import { Meal, UserProfile } from './types';

export class ReminderBulkDB extends Dexie {
  meals!: Table<Meal>;
  profile!: Table<UserProfile>;

  constructor() {
    super('ReminderBulkDB');
    (this as any).version(1).stores({
      meals: '++id, scheduledTime, isCompleted',
      profile: '++id'
    });
  }
}

export const db = new ReminderBulkDB();

// Initialize profile if not exists
export const initProfile = async () => {
  const count = await db.profile.count();
  if (count === 0) {
    await db.profile.add({
      name: 'User',
      calorieGoal: 3000,
      proteinGoal: 180,
      dailyReminderEnabled: true
    });
  }
};