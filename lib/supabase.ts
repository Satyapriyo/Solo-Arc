import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable this to handle deep links
    storage: {
      getItem: (key) => {
        try {
          return Promise.resolve(global.localStorage?.getItem(key) ?? null);
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem: (key, value) => {
        try {
          global.localStorage?.setItem(key, value);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      removeItem: (key) => {
        try {
          global.localStorage?.removeItem(key);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
    },
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          level: number;
          total_xp: number;
          current_xp: number;
          strength: number;
          endurance: number;
          discipline: number;
          agility: number;
          intelligence: number;
          luck: number;
          streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          level?: number;
          total_xp?: number;
          current_xp?: number;
          strength?: number;
          endurance?: number;
          discipline?: number;
          agility?: number;
          intelligence?: number;
          luck?: number;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          level?: number;
          total_xp?: number;
          current_xp?: number;
          strength?: number;
          endurance?: number;
          discipline?: number;
          agility?: number;
          intelligence?: number;
          luck?: number;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          type: string;
          difficulty: string;
          xp_reward: number;
          completed: boolean;
          completed_at: string | null;
          streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          type: string;
          difficulty: string;
          xp_reward: number;
          completed?: boolean;
          completed_at?: string | null;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          type?: string;
          difficulty?: string;
          xp_reward?: number;
          completed?: boolean;
          completed_at?: string | null;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          duration: number;
          xp_earned: number;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          duration: number;
          xp_earned: number;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          duration?: number;
          xp_earned?: number;
          completed_at?: string;
          created_at?: string;
        };
      };
      punishments: {
        Row: {
          id: string;
          user_id: string;
          reason: string;
          penalty: string;
          xp_lost: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reason: string;
          penalty: string;
          xp_lost: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reason?: string;
          penalty?: string;
          xp_lost?: number;
          created_at?: string;
        };
      };
    };
  };
};
