import { useProfile } from '@/hooks/useProfile';
import { useTasks } from '@/hooks/useTasks';
import { useWorkouts } from '@/hooks/useWorkouts';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Calendar, Target, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
    const { profile } = useProfile();
    const { tasks } = useTasks();
    const { workouts } = useWorkouts();

    if (!profile) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading Progress...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Calculate weekly progress - last 7 days
    const today = new Date();
    const weekDays = [];

    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        weekDays.push(date);
    }

    const weeklyProgress = weekDays.map((date) => {
        const dayName = date.toLocaleDateString('en', { weekday: 'short' });
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        // Count tasks completed on this specific day
        const dayTasks = tasks.filter(task => {
            if (!task.completed || !task.completed_at) return false;
            const taskDate = new Date(task.completed_at);
            return taskDate >= dayStart && taskDate <= dayEnd;
        });

        // Count total daily tasks that were available on this day
        const totalDailyTasks = tasks.filter(task => {
            if (task.type !== 'daily') return false;
            const taskCreated = new Date(task.created_at);
            return taskCreated <= dayEnd; // Task existed on this day
        }).length;

        return {
            day: dayName,
            date: date,
            completed: dayTasks.length,
            total: Math.max(totalDailyTasks, 3), // At least 3 for display
        };
    });

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalWorkouts = workouts.length;

    // Calculate actual streak based on task completion
    const calculateStreak = () => {
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
            const hasTasksCompleted = tasks.some(task => {
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

    const actualStreak = calculateStreak();

    const maxCompleted = Math.max(...weeklyProgress.map(d => d.completed), 1);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}>
                    <Text style={styles.headerTitle}>Progress Tracker</Text>
                    <Text style={styles.headerSubtitle}>Your hunter journey stats</Text>
                </LinearGradient>

                {/* Weekly Progress Chart */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Calendar size={24} color="#3B82F6" />
                        <Text style={styles.sectionTitle}>This Week</Text>
                    </View>

                    <View style={styles.chartContainer}>
                        <View style={styles.chart}>
                            {weeklyProgress.map((day, index) => {
                                const barHeight = (day.completed / Math.max(maxCompleted, 1)) * 120;
                                const isToday = day.date.toDateString() === today.toDateString();

                                return (
                                    <View key={index} style={styles.chartBar}>
                                        <View style={styles.barContainer}>
                                            <LinearGradient
                                                colors={
                                                    day.completed > 0
                                                        ? ['#3B82F6', '#2563EB']
                                                        : ['#374151', '#4B5563']
                                                }
                                                style={[styles.bar, { height: Math.max(barHeight, 4) }]}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.barLabel,
                                            isToday && { color: '#3B82F6', fontWeight: 'bold' }
                                        ]}>
                                            {day.day}
                                        </Text>
                                        <Text style={styles.barValue}>{day.completed}</Text>
                                        <Text style={styles.barDate}>
                                            {day.date.getDate()}/{day.date.getMonth() + 1}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Monthly Stats */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={24} color="#7C3AED" />
                        <Text style={styles.sectionTitle}>This Month</Text>
                    </View>

                    <View style={styles.statsGrid}>
                        <StatCard
                            title="Total XP"
                            value={profile.total_xp.toLocaleString()}
                            color="#3B82F6"
                            icon="⚡"
                        />
                        <StatCard
                            title="Tasks Done"
                            value={completedTasks}
                            color="#60A5FA"
                            icon="✅"
                        />
                        <StatCard
                            title="Current Streak"
                            value={`${actualStreak} days`}
                            color="#8B5CF6"
                            icon="🔥"
                        />
                        <StatCard
                            title="Workouts"
                            value={totalWorkouts}
                            color="#7C3AED"
                            icon="💪"
                        />
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Award size={24} color="#60A5FA" />
                        <Text style={styles.sectionTitle}>Hunter Achievements</Text>
                    </View>

                    <View style={styles.achievementsList}>
                        {getAchievements(profile, completedTasks, totalWorkouts, actualStreak).map((achievement) => (
                            <View
                                key={achievement.id}
                                style={[
                                    styles.achievementCard,
                                    achievement.earned && styles.achievementEarned
                                ]}>
                                <LinearGradient
                                    colors={
                                        achievement.earned
                                            ? ['#60A5FA20', '#3B82F620']
                                            : ['#1E293B', '#334155']
                                    }
                                    style={styles.achievementGradient}>

                                    <View style={styles.achievementContent}>
                                        <View style={[
                                            styles.achievementIcon,
                                            { backgroundColor: achievement.earned ? '#60A5FA' : '#64748B' }
                                        ]}>
                                            <Text style={styles.achievementIconText}>
                                                {achievement.earned ? '🏆' : '🔒'}
                                            </Text>
                                        </View>

                                        <View style={styles.achievementText}>
                                            <Text style={[
                                                styles.achievementName,
                                                { color: achievement.earned ? '#60A5FA' : '#94A3B8' }
                                            ]}>
                                                {achievement.name}
                                            </Text>
                                            <Text style={styles.achievementDesc}>
                                                {achievement.desc}
                                            </Text>
                                        </View>

                                        {achievement.earned && (
                                            <View style={styles.achievementBadge}>
                                                <Text style={styles.achievementBadgeText}>EARNED</Text>
                                            </View>
                                        )}
                                    </View>
                                </LinearGradient>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Progress Insights */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Target size={24} color="#8B5CF6" />
                        <Text style={styles.sectionTitle}>Insights</Text>
                    </View>

                    <View style={styles.insightCard}>
                        <LinearGradient
                            colors={['#1E293B', '#334155']}
                            style={styles.insightGradient}>

                            <Text style={styles.insightTitle}>Weekly Summary</Text>
                            <Text style={styles.insightText}>
                                You&apos;re making great progress! You&apos;ve completed {completedTasks} tasks and
                                {totalWorkouts} workouts. Your current level is {profile.level} with {profile.total_xp.toLocaleString()} total XP.
                                Keep pushing to maintain your {actualStreak}-day streak!
                            </Text>

                            <View style={styles.insightStats}>
                                <View style={styles.insightStat}>
                                    <Text style={styles.insightStatValue}>{profile.level}</Text>
                                    <Text style={styles.insightStatLabel}>Level</Text>
                                </View>
                                <View style={styles.insightStat}>
                                    <Text style={styles.insightStatValue}>{completedTasks}</Text>
                                    <Text style={styles.insightStatLabel}>Tasks Done</Text>
                                </View>
                                <View style={styles.insightStat}>
                                    <Text style={styles.insightStatValue}>{actualStreak}</Text>
                                    <Text style={styles.insightStatLabel}>Day Streak</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function getAchievements(profile: any, completedTasks: number, totalWorkouts: number, actualStreak: number) {
    return [
        {
            id: 1,
            name: 'First Steps',
            desc: 'Complete your first task',
            earned: completedTasks > 0
        },
        {
            id: 2,
            name: 'Consistency Master',
            desc: 'Maintain a 7-day streak',
            earned: actualStreak >= 7
        },
        {
            id: 3,
            name: 'Workout Warrior',
            desc: 'Complete 10 workouts',
            earned: totalWorkouts >= 10
        },
        {
            id: 4,
            name: 'Level Up',
            desc: 'Reach level 5',
            earned: profile.level >= 5
        },
    ];
}

function StatCard({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: string }) {
    return (
        <View style={[styles.statCard, { borderColor: color + '30' }]}>
            <LinearGradient
                colors={[color + '20', color + '10']}
                style={styles.statCardGradient}>
                <Text style={styles.statCardIcon}>{icon}</Text>
                <Text style={styles.statCardTitle}>{title}</Text>
                <Text style={[styles.statCardValue, { color }]}>{value}</Text>
            </LinearGradient>
        </View>
    );
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
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#E2E8F0',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 4,
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
    chartContainer: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 160,
    },
    chartBar: {
        alignItems: 'center',
        flex: 1,
    },
    barContainer: {
        height: 120,
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    bar: {
        width: 24,
        borderRadius: 12,
        minHeight: 4,
    },
    barLabel: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    barValue: {
        color: '#E2E8F0',
        fontSize: 10,
        fontWeight: '500',
    },
    barDate: {
        color: '#64748B',
        fontSize: 9,
        fontWeight: '500',
        marginTop: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: (width - 52) / 2,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    statCardGradient: {
        padding: 16,
        alignItems: 'center',
    },
    statCardIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statCardTitle: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    statCardValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    achievementsList: {
        gap: 12,
    },
    achievementCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    achievementEarned: {
        borderWidth: 1,
        borderColor: '#F59E0B30',
    },
    achievementGradient: {
        padding: 16,
    },
    achievementContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    achievementIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    achievementIconText: {
        fontSize: 20,
    },
    achievementText: {
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
    achievementBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    achievementBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    insightCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    insightGradient: {
        padding: 20,
    },
    insightTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    insightText: {
        color: '#94A3B8',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    insightStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    insightStat: {
        alignItems: 'center',
    },
    insightStatValue: {
        color: '#10B981',
        fontSize: 20,
        fontWeight: 'bold',
    },
    insightStatLabel: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
});