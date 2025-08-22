import { AuthContext } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import type { Database } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { useCallback, useContext, useEffect, useState } from "react";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

export function useTasks() {
  const { state } = useContext(AuthContext);
  const user = state.user;
  const { addXP, removeXP, updateProfile } = useProfile();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user || !user.sub) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.sub)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data || []);

        // Sync the user's streak after fetching tasks
        if (data && data.length > 0) {
          const userStreak = calculateUserStreak(data);
          await updateProfile({ streak: userStreak });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user, updateProfile]);

  useEffect(() => {
    if (user && user.sub) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  const addTask = async (taskData: Omit<TaskInsert, "user_id">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          user_id: user.sub,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding task:", error);
        return { error };
      } else {
        setTasks((prev) => [data, ...prev]);
        return { data };
      }
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  };

  const calculateUserStreak = (updatedTasks: Task[]) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Check if any tasks were completed on this day
      const hasTasksCompleted = updatedTasks.some((task) => {
        if (!task.completed || !task.completed_at) return false;
        const taskDate = new Date(task.completed_at);
        return taskDate >= dayStart && taskDate <= dayEnd;
      });

      if (hasTasksCompleted) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // If it's today and no tasks completed yet, don't break the streak
        if (currentDate.toDateString() === today.toDateString()) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return streak;
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isCompleting = !task.completed;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          completed: isCompleting,
          completed_at: isCompleting ? new Date().toISOString() : null,
          streak: isCompleting ? task.streak + 1 : Math.max(0, task.streak - 1),
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) {
        console.error("Error updating task:", error);
        return { error };
      } else {
        const updatedTasks = tasks.map((t) => (t.id === taskId ? data : t));
        setTasks(updatedTasks);

        // Calculate and update the user's overall streak
        const userStreak = calculateUserStreak(updatedTasks);

        // Add or remove XP based on task completion and update profile streak
        if (isCompleting) {
          await addXP(task.xp_reward);
        } else {
          await removeXP(task.xp_reward);
        }

        // Update profile streak
        if (user && user.sub) {
          await updateProfile({ streak: userStreak });
        }

        return { data };
      }
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
        console.error("Error deleting task:", error);
        return { error };
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        return { success: true };
      }
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    refetch: fetchTasks,
  };
}
