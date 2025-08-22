import { AuthContext } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import type { Database } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { useCallback, useContext, useEffect, useState } from "react";

type Workout = Database["public"]["Tables"]["workouts"]["Row"];
type WorkoutInsert = Database["public"]["Tables"]["workouts"]["Insert"];

export function useWorkouts() {
  const { state } = useContext(AuthContext);
  const user = state.user;

  const { addXP } = useProfile();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = useCallback(async () => {
    if (!user || !user.sub) return;

    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.sub)
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Error fetching workouts:", error);
      } else {
        setWorkouts(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.sub) {
      fetchWorkouts();
    }
  }, [user, fetchWorkouts]);

  const addWorkout = async (workoutData: Omit<WorkoutInsert, "user_id">) => {
    if (!user || !user.sub) return;

    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert({
          ...workoutData,
          user_id: user.sub,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding workout:", error);
        return { error };
      } else {
        setWorkouts((prev) => [data, ...prev]);

        // Add XP for workout
        await addXP(workoutData.xp_earned);

        return { data };
      }
    } catch (error) {
      console.error("Error:", error);
      return { error };
    }
  };

  return {
    workouts,
    loading,
    addWorkout,
    refetch: fetchWorkouts,
  };
}
