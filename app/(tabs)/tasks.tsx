import { useTasks } from "@/hooks/useTasks";
import { LinearGradient } from "expo-linear-gradient";
import { Clock, Dumbbell, Plus, Target, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksScreen() {
  const { tasks, addTask, toggleTask } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    type: "workout",
    difficulty: "medium",
  });
  const [addingTask, setAddingTask] = useState(false);

  const handleAddTask = async () => {
    if (newTask.name.trim()) {
      setAddingTask(true);
      const xpMap = { easy: 25, medium: 50, hard: 100 };

      const result = await addTask({
        name: newTask.name,
        description: "Custom task",
        type: newTask.type,
        difficulty: newTask.difficulty,
        xp_reward: xpMap[newTask.difficulty as keyof typeof xpMap],
      });

      if (!result?.error) {
        setNewTask({ name: "", type: "workout", difficulty: "medium" });
        setShowModal(false);
      }
      setAddingTask(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "workout":
        return <Dumbbell size={20} color="#60A5FA" />;
      case "cardio":
        return <Target size={20} color="#8B5CF6" />;
      case "mental":
        return <Clock size={20} color="#7C3AED" />;
      default:
        return <Target size={20} color="#3B82F6" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "#60A5FA";
      case "medium":
        return "#8B5CF6";
      case "hard":
        return "#7C3AED";
      default:
        return "#3B82F6";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#7C3AED", "#5B21B6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Quest Board</Text>
          <Text style={styles.headerSubtitle}>
            Choose your daily challenges
          </Text>
        </LinearGradient>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {tasks.filter((t) => t.completed).length}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {tasks.filter((t) => !t.completed).length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {tasks.reduce(
                (sum, task) => (task.completed ? sum + task.xp_reward : sum),
                0
              )}
            </Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
        </View>

        {/* Tasks List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            <Pressable
              style={styles.addButton}
              onPress={() => setShowModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.tasksList}>
            {tasks.map((task) => (
              <Pressable
                key={task.id}
                style={[
                  styles.taskCard,
                  task.completed && styles.taskCompleted,
                ]}
                onPress={() => toggleTask(task.id)}
              >
                <LinearGradient
                  colors={
                    task.completed
                      ? ["#3B82F620", "#2563EB"]
                      : ["#1E293B", "#334155"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.taskGradient}
                >
                  <View style={styles.taskHeader}>
                    <View style={styles.taskInfo}>
                      {getTypeIcon(task.type)}
                      <View style={styles.taskDetails}>
                        <Text
                          style={[
                            styles.taskName,
                            task.completed && styles.taskNameCompleted,
                          ]}
                        >
                          {task.name}
                        </Text>
                        <Text style={styles.taskDescription}>
                          {task.description}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.taskMeta}>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor:
                              getDifficultyColor(task.difficulty) + "20",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.difficultyText,
                            { color: getDifficultyColor(task.difficulty) },
                          ]}
                        >
                          {task.difficulty.toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.xpText}>+{task.xp_reward} XP</Text>
                    </View>
                  </View>

                  <View style={styles.taskFooter}>
                    <Text style={styles.streakText}>
                      🔥 {task.streak} day streak
                    </Text>
                    <View
                      style={[
                        styles.checkBox,
                        task.completed && styles.checkBoxCompleted,
                      ]}
                    >
                      <Text style={styles.checkMark}>
                        {task.completed ? "✓" : ""}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={["#1E293B", "#334155"]}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Quest</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowModal(false)}
                >
                  <X size={24} color="#94A3B8" />
                </Pressable>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Quest Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={newTask.name}
                  onChangeText={(text) =>
                    setNewTask({ ...newTask, name: text })
                  }
                  placeholder="Enter quest name..."
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Type</Text>
                <View style={styles.buttonGroup}>
                  {["workout", "cardio", "mental"].map((type) => (
                    <Pressable
                      key={type}
                      style={[
                        styles.typeButton,
                        newTask.type === type && styles.typeButtonActive,
                      ]}
                      onPress={() => setNewTask({ ...newTask, type })}
                    >
                      <Text
                        style={[
                          styles.typeButtonText,
                          newTask.type === type && styles.typeButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Difficulty</Text>
                <View style={styles.buttonGroup}>
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <Pressable
                      key={difficulty}
                      style={[
                        styles.difficultyButton,
                        newTask.difficulty === difficulty &&
                        styles.difficultyButtonActive,
                        { borderColor: getDifficultyColor(difficulty) + "50" },
                      ]}
                      onPress={() => setNewTask({ ...newTask, difficulty })}
                    >
                      <Text
                        style={[
                          styles.difficultyButtonText,
                          newTask.difficulty === difficulty && {
                            color: getDifficultyColor(difficulty),
                          },
                        ]}
                      >
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                style={[
                  styles.createButton,
                  addingTask && styles.createButtonDisabled,
                ]}
                onPress={handleAddTask}
                disabled={addingTask}
              >
                <LinearGradient
                  colors={
                    addingTask ? ["#64748B", "#475569"] : ["#10B981", "#059669"]
                  }
                  style={styles.createButtonGradient}
                >
                  <Text style={styles.createButtonText}>
                    {addingTask ? "Creating..." : "Create Quest"}
                  </Text>
                </LinearGradient>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  header: {
    padding: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  tasksList: {
    gap: 12,
  },
  taskCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  taskCompleted: {
    opacity: 0.8,
  },
  taskGradient: {
    padding: 16,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskDetails: {
    marginLeft: 12,
    flex: 1,
  },
  taskName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskNameCompleted: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  taskDescription: {
    color: "#94A3B8",
    fontSize: 14,
  },
  taskMeta: {
    alignItems: "flex-end",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  xpText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakText: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "500",
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#64748B",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    overflow: "hidden",
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#374151",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#3B82F6",
  },
  typeButtonText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  difficultyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#374151",
    borderWidth: 1,
    alignItems: "center",
  },
  difficultyButtonActive: {
    borderWidth: 2,
  },
  difficultyButtonText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  createButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
});
