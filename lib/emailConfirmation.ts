import { supabase } from "@/lib/supabase";

// Test function to manually confirm email
export async function testEmailConfirmation(
  token: string,
  type: string = "signup"
) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    });

    if (error) {
      console.error("Email confirmation error:", error);
      return { success: false, error };
    }

    console.log("Email confirmed successfully:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
}

// Alternative approach - handle email confirmation with session
export async function handleEmailLink(url: string) {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      return { success: false, error };
    }

    // If we have a session, the email was confirmed
    if (data.session) {
      console.log("Session found, email confirmed");
      return { success: true, session: data.session };
    }

    return { success: false, error: "No session found" };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err };
  }
}
