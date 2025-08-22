import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type LeaderboardEntry = {
  id: string;
  name: string;
  level: number;
  total_xp: number;
  rank: number;
};

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, level, total_xp")
        .order("total_xp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        const leaderboardWithRanks = (data || []).map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
        setLeaderboard(leaderboardWithRanks);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboard,
    loading,
    refetch: fetchLeaderboard,
  };
}
