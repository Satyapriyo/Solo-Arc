import { AuthContext } from '@/contexts/AuthContext';
import type { Database } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useCallback, useContext, useEffect, useState } from 'react';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useProfile() {
    const { state } = useContext(AuthContext);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const user = state.user;

    const fetchProfile = useCallback(async () => {
        if (!user || !user.sub) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.sub)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.sub) {
            fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user, fetchProfile]);

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user || !profile) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.sub)
                .select()
                .single();

            if (error) {
                console.error('Error updating profile:', error);
                return { error };
            } else {
                setProfile(data);
                return { data };
            }
        } catch (error) {
            console.error('Error:', error);
            return { error };
        }
    };

    const addXP = async (xpAmount: number) => {
        if (!profile) return;

        const newTotalXP = profile.total_xp + xpAmount;
        const newCurrentXP = profile.current_xp + xpAmount;
        const xpPerLevel = 3000;

        let newLevel = profile.level;
        let finalCurrentXP = newCurrentXP;

        // Check for level up
        if (newCurrentXP >= xpPerLevel) {
            newLevel = Math.floor(newTotalXP / xpPerLevel) + 1;
            finalCurrentXP = newTotalXP % xpPerLevel;
        }

        return updateProfile({
            total_xp: newTotalXP,
            current_xp: finalCurrentXP,
            level: newLevel,
        });
    };

    const removeXP = async (xpAmount: number) => {
        if (!profile) return;

        const newTotalXP = Math.max(0, profile.total_xp - xpAmount);
        const xpPerLevel = 3000;

        // Recalculate level and current XP based on new total XP
        let newLevel = Math.floor(newTotalXP / xpPerLevel) + 1;
        let newCurrentXP = newTotalXP % xpPerLevel;

        // Ensure minimum level is 1
        if (newLevel < 1) {
            newLevel = 1;
            newCurrentXP = Math.max(0, newTotalXP);
        }

        return updateProfile({
            total_xp: newTotalXP,
            current_xp: newCurrentXP,
            level: newLevel,
        });
    };

    return {
        profile,
        loading,
        updateProfile,
        addXP,
        removeXP,
        refetch: fetchProfile,
    };
}