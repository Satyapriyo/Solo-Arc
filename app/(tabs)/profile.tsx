import { AuthContext } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTasks } from '@/hooks/useTasks';
import { useWorkouts } from '@/hooks/useWorkouts';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Shield, Target, Trophy } from 'lucide-react-native';
import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { signOut } = useContext(AuthContext);
    const { profile } = useProfile();
    const { tasks } = useTasks();
    const { workouts } = useWorkouts();

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading Profile...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const xpProgress = (profile.current_xp / 3000) * 100;
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalWorkouts = workouts.length;

    const getRankTitle = (level: number) => {
        if (level >= 50) return 'S-Rank Hunter';
        if (level >= 30) return 'A-Rank Hunter';
        if (level >= 20) return 'B-Rank Hunter';
        if (level >= 10) return 'C-Rank Hunter';
        if (level >= 5) return 'D-Rank Hunter';
        return 'E-Rank Awakened';
    };

    const getStatColor = (value: number) => {
        if (value >= 80) return '#10B981';
        if (value >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <LinearGradient
                    colors={['#1E40AF', '#3730A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}>

                    <View style={styles.profileSection}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#F59E0B', '#D97706']}
                                style={styles.avatar}>
                                <Text style={styles.avatarText}>🥷</Text>
                            </LinearGradient>
                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>{profile.level}</Text>
                            </View>
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{profile.name}</Text>
                            <View style={styles.titleContainer}>
                                <Crown size={16} color="#F59E0B" />
                                <Text style={styles.userTitle}>{getRankTitle(profile.level)}</Text>
                            </View>
                            <Text style={styles.joinDate}>
                                Hunter since {new Date(profile.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    {/* XP Progress */}
                    <View style={styles.xpSection}>
                        <View style={styles.xpBar}>
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.xpFill, { width: `${xpProgress}%` }]}
                            />
                        </View>
                        <Text style={styles.xpText}>
                            {profile.current_xp} / 3000 XP to next level
                        </Text>
                    </View>
                </LinearGradient>

                {/* Stats */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Shield size={24} color="#3B82F6" />
                        <Text style={styles.sectionTitle}>Hunter Stats</Text>
                    </View>

                    <View style={styles.statsGrid}>
                        {Object.entries({
                            strength: profile.strength,
                            endurance: profile.endurance,
                            discipline: profile.discipline,
                            agility: profile.agility,
                            intelligence: profile.intelligence,
                            luck: profile.luck,
                        }).map(([stat, value]) => (
                            <View key={stat} style={styles.statItem}>
                                <View style={styles.statHeader}>
                                    <Text style={styles.statName}>
                                        {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                    </Text>
                                    <Text style={[styles.statValue, { color: getStatColor(value) }]}>
                                        {value}
                                    </Text>
                                </View>
                                <View style={styles.statBarContainer}>
                                    <View style={[styles.statBar, { backgroundColor: getStatColor(value) + '20' }]}>
                                        <LinearGradient
                                            colors={[getStatColor(value), getStatColor(value) + '80']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[styles.statBarFill, { width: `${value}%` }]}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Achievements */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Trophy size={24} color="#F59E0B" />
                        <Text style={styles.sectionTitle}>Recent Achievements</Text>
                    </View>

                    <View style={styles.achievementsList}>
                        {getAchievements(profile, completedTasks, totalWorkouts).slice(0, 3).map((achievement, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.achievementItem,
                                    achievement.earned && styles.achievementEarned
                                ]}>
                                <View style={[
                                    styles.achievementIcon,
                                    { backgroundColor: achievement.earned ? '#F59E0B' : '#64748B' }
                                ]}>
                                    <Text style={styles.achievementIconText}>
                                        {achievement.earned ? '🏆' : '🔒'}
                                    </Text>
                                </View>
                                <View style={styles.achievementContent}>
                                    <Text style={[
                                        styles.achievementName,
                                        { color: achievement.earned ? '#F59E0B' : '#64748B' }
                                    ]}>
                                        {achievement.name}
                                    </Text>
                                    <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Hunter Stats Summary */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Target size={24} color="#3B82F6" />
                        <Text style={styles.sectionTitle}>Hunter Summary</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <LinearGradient
                            colors={['#1E293B', '#334155']}
                            style={styles.summaryGradient}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total Tasks Completed</Text>
                                <Text style={styles.summaryValue}>{completedTasks}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total Workouts</Text>
                                <Text style={styles.summaryValue}>{totalWorkouts}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Current Streak</Text>
                                <Text style={styles.summaryValue}>{profile.streak} days</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Hunter Rank</Text>
                                <Text style={styles.summaryValue}>{getRankTitle(profile.level)}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.section}>
                    <View style={styles.actionButtons}>


                        <Pressable style={styles.actionButton} onPress={signOut}>
                            <LinearGradient
                                colors={['#64748B', '#475569']}
                                style={styles.actionGradient}>
                                <Target size={20} color="#FFFFFF" />
                                <Text style={styles.actionText}>Sign Out</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function getAchievements(profile: any, completedTasks: number, totalWorkouts: number) {
    return [
        {
            name: 'First Steps',
            desc: 'Complete your first quest',
            earned: completedTasks > 0
        },
        {
            name: 'Consistency Master',
            desc: 'Maintain a 7-day streak',
            earned: profile.streak >= 7
        },
        {
            name: 'Workout Warrior',
            desc: 'Complete 10 workouts',
            earned: totalWorkouts >= 10
        },
        {
            name: 'Level Master',
            desc: 'Reach level 10',
            earned: profile.level >= 10
        },
    ];
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    header: {
        padding: 24,
        paddingTop: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 32,
    },
    levelBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#10B981',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#1E40AF',
    },
    levelText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userTitle: {
        color: '#F59E0B',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    joinDate: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    xpSection: {
        marginTop: 16,
    },
    xpBar: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    xpFill: {
        height: '100%',
        borderRadius: 4,
    },
    xpText: {
        color: '#E2E8F0',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    statsGrid: {
        gap: 16,
    },
    statItem: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statName: {
        color: '#E2E8F0',
        fontSize: 16,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statBarContainer: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    statBar: {
        flex: 1,
        borderRadius: 3,
    },
    statBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    achievementsList: {
        gap: 12,
    },
    achievementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
    },
    achievementEarned: {
        borderWidth: 1,
        borderColor: '#F59E0B30',
        backgroundColor: '#F59E0B10',
    },
    achievementIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    achievementIconText: {
        fontSize: 16,
    },
    achievementContent: {
        flex: 1,
    },
    achievementName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    achievementDesc: {
        color: '#94A3B8',
        fontSize: 14,
    },
    summaryCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    summaryGradient: {
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
    },
    summaryValue: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    actionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});