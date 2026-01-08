
import { useState, useEffect, useCallback } from 'react';
import { db } from '../db';
import { Meal, DailyProgress } from '../types';
import { scheduleMealNotification, cancelMealNotification } from '../services/notifications';

export const useMealLogic = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [progress, setProgress] = useState<DailyProgress>({
    totalCalories: 0,
    totalProtein: 0,
    completedCalories: 0,
    completedProtein: 0,
  });

  const fetchMeals = useCallback(async () => {
    const allMeals = await db.meals.orderBy('scheduledTime').toArray();
    setMeals(allMeals);
    
    const totals = allMeals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.calories;
        acc.totalProtein += meal.protein;
        if (meal.isCompleted) {
          acc.completedCalories += meal.calories;
          acc.completedProtein += meal.protein;
        }
        return acc;
      },
      { totalCalories: 0, totalProtein: 0, completedCalories: 0, completedProtein: 0 }
    );
    setProgress(totals);
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const shiftSchedules = async (completedMealId: number, actualTime: Date) => {
    const mealToComplete = await db.meals.get(completedMealId);
    if (!mealToComplete) return;

    const scheduledDate = new Date(mealToComplete.scheduledTime);
    const deltaMs = actualTime.getTime() - scheduledDate.getTime();

    // Only shift if we are LATE (delta > 0)
    if (deltaMs > 0) {
      const allMeals = await db.meals.orderBy('scheduledTime').toArray();
      const updates = allMeals
        .filter(m => !m.isCompleted && m.id !== completedMealId && new Date(m.scheduledTime) > scheduledDate)
        .map(m => {
          const oldTime = new Date(m.scheduledTime);
          const newTime = new Date(oldTime.getTime() + deltaMs);
          return { ...m, scheduledTime: newTime.toISOString() };
        });

      for (const update of updates) {
        if (update.id) {
          await db.meals.update(update.id, { scheduledTime: update.scheduledTime });
          // Reschedule notification for shifted meal
          scheduleMealNotification(update.id, update.name, new Date(update.scheduledTime));
        }
      }
    }

    await db.meals.update(completedMealId, {
      isCompleted: true,
      actualTime: actualTime.toISOString()
    });
    cancelMealNotification(completedMealId);

    await fetchMeals();
  };

  const snoozeMeal = async (mealId: number) => {
    const meal = await db.meals.get(mealId);
    if (!meal) return;

    const oldTime = new Date(meal.scheduledTime);
    const newTime = new Date(oldTime.getTime() + 15 * 60000); // 15 min snooze

    await db.meals.update(mealId, {
      scheduledTime: newTime.toISOString(),
      snoozeCount: (meal.snoozeCount || 0) + 1
    });

    scheduleMealNotification(mealId, meal.name, newTime);
    await fetchMeals();
  };

  const addMeal = async (meal: Omit<Meal, 'id' | 'isCompleted' | 'snoozeCount' | 'order'>) => {
    const count = await db.meals.count();
    const id = await db.meals.add({
      ...meal,
      isCompleted: false,
      snoozeCount: 0,
      order: count
    });
    
    if (typeof id === 'number') {
      scheduleMealNotification(id, meal.name, new Date(meal.scheduledTime));
    }
    await fetchMeals();
  };

  const updateMeal = async (id: number, updates: Partial<Meal>) => {
    await db.meals.update(id, updates);
    const updated = await db.meals.get(id);
    if (updated && !updated.isCompleted) {
      scheduleMealNotification(id, updated.name, new Date(updated.scheduledTime));
    }
    await fetchMeals();
  };

  const deleteMeal = async (id: number) => {
    await db.meals.delete(id);
    cancelMealNotification(id);
    await fetchMeals();
  };

  return {
    meals,
    progress,
    shiftSchedules,
    snoozeMeal,
    addMeal,
    updateMeal,
    deleteMeal,
    refresh: fetchMeals
  };
};
