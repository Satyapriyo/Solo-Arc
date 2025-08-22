import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect } from "react";

// Test hook to debug profile fetching
export function useProfileDebug() {
  const { state } = useContext(AuthContext);
  const user = state.user;

  useEffect(() => {
    const testProfileFetch = async () => {
      console.log("=== PROFILE DEBUG TEST ===");
      console.log("User object:", user);
      console.log("User.sub:", user?.sub);
      console.log("User.sub type:", typeof user?.sub);

      if (!user?.sub) {
        console.log("❌ No user.sub available");
        return;
      }

      try {
        console.log("🔍 Testing profile query...");

        // Test 1: Simple select all
        console.log("Test 1: Select all profiles");
        const { data: allProfiles, error: allError } = await supabase
          .from("profiles")
          .select("*");

        console.log("All profiles result:", {
          data: allProfiles,
          error: allError,
        });

        // Test 2: Count profiles
        console.log("Test 2: Count profiles");
        const { count, error: countError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        console.log("Profile count result:", { count, error: countError });

        // Test 3: Query specific profile
        console.log("Test 3: Query specific profile");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.sub);

        console.log("Specific profile query result:", {
          data: profileData,
          error: profileError,
        });

        // Test 4: Query with single() - this is what's failing
        console.log("Test 4: Query with .single()");
        const { data: singleProfile, error: singleError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.sub)
          .single();

        console.log("Single profile result:", {
          data: singleProfile,
          error: singleError,
        });
      } catch (error) {
        console.error("❌ Test error:", error);
      }
    };

    if (user?.sub) {
      testProfileFetch();
    }
  }, [user]);

  return null;
}
