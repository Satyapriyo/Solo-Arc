import AddTaskModal from '@/components/AddTaskModal';
import { AuthGuard } from '@/components/AuthGuard';
import WorkoutModal from '@/components/WorkoutModal';
import { useProfile } from '@/hooks/useProfile';
import { useTasks } from '@/hooks/useTasks';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Target, Trophy, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function DashboardScreen() {
  const { profile } = useProfile();
  const { tasks, toggleTask, addTask } = useTasks();
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Hunter Data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const xpPercentage = (profile.current_xp / 3000) * 100;
  const dailyTasks = tasks.filter(task => task.type === 'daily').slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#1E40AF', '#3730A3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, {profile.name}</Text>
          <Text style={styles.levelText}>Level {profile.level}</Text>

          {/* XP Bar */}
          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.xpFill, { width: `${xpPercentage}%` }]}
              />
            </View>
            <Text style={styles.xpText}>
              {profile.current_xp} / 3000 XP
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              icon={<Zap size={24} color="#60A5FA" />}
              title="Strength"
              value={profile.strength}
              color="#60A5FA"
            />
            <StatCard
              icon={<Target size={24} color="#3B82F6" />}
              title="Endurance"
              value={profile.endurance}
              color="#3B82F6"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon={<Trophy size={24} color="#7C3AED" />}
              title="Discipline"
              value={profile.discipline}
              color="#7C3AED"
            />
            <StatCard
              icon={<Flame size={24} color="#8B5CF6" />}
              title="Streak"
              value={profile.streak}
              color="#8B5CF6"
              suffix="days"
            />
          </View>
        </View>

        {/* Daily Quests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          <View style={styles.questContainer}>
            {dailyTasks.length > 0 ? (
              dailyTasks.map((quest) => (
                <Pressable
                  key={quest.id}
                  style={[
                    styles.questCard,
                    quest.completed && styles.questCompleted
                  ]}
                  onPress={() => toggleTask(quest.id)}>
                  <View style={styles.questContent}>
                    <Text style={[
                      styles.questName,
                      quest.completed && styles.questNameCompleted
                    ]}>
                      {quest.name}
                    </Text>
                    <Text style={styles.questXP}>+{quest.xp_reward} XP</Text>
                  </View>
                  <View style={[
                    styles.questStatus,
                    quest.completed && styles.questStatusCompleted
                  ]}>
                    <Text style={styles.questStatusText}>
                      {quest.completed ? '✓' : '○'}
                    </Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No daily quests yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Tap &quot;Add Task&quot; to create your first daily quest!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <ActionButton
              title="Start Workout"
              subtitle="Begin training"
              gradient={['#8B5CF6', '#7C3AED']}
              onPress={() => setShowWorkoutModal(true)}
            />
            <ActionButton
              title="Add Task"
              subtitle="New quest"
              gradient={['#3B82F6', '#2563EB']}
              onPress={() => setShowAddTaskModal(true)}
            />
          </View>
        </View>
      </ScrollView>

      <WorkoutModal
        visible={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
      />

      <AddTaskModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAddTask={addTask}
      />
    </SafeAreaView>
  );
}

function StatCard({ icon, title, value, color, suffix = '' }: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <LinearGradient
        colors={[color + '20', color + '10']}
        style={styles.statGradient}>
        <View style={styles.statIcon}>{icon}</View>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color }]}>
          {value}{suffix}
        </Text>
      </LinearGradient>
    </View>
  );
}

function ActionButton({ title, subtitle, gradient, onPress }: {
  title: string;
  subtitle: string;
  gradient: [string, string, ...string[]];
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionGradient}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <AuthGuard>
      <DashboardScreen />
    </AuthGuard>
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
  welcomeText: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '500',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  xpContainer: {
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 8,
  },
  statTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questContainer: {
    gap: 12,
  },
  emptyState: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  questCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  questCompleted: {
    backgroundColor: '#3B82F620',
    borderColor: '#3B82F6',
  },
  questContent: {
    flex: 1,
  },
  questName: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  questNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  questXP: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  questStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questStatusCompleted: {
    backgroundColor: '#3B82F6',
  },
  questStatusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
});