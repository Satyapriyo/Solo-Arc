import { LinearGradient } from 'expo-linear-gradient';
import { Plus, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onAddTask: (task: {
        name: string;
        description: string;
        type: string;
        difficulty: string;
        xp_reward: number;
    }) => void;
}

export default function AddTaskModal({ visible, onClose, onAddTask }: AddTaskModalProps) {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskType, setTaskType] = useState('daily');
    const [taskDifficulty, setTaskDifficulty] = useState('easy');

    const difficulties = [
        { label: 'Easy', value: 'easy', xp: 10, color: '#60A5FA' },
        { label: 'Medium', value: 'medium', xp: 20, color: '#8B5CF6' },
        { label: 'Hard', value: 'hard', xp: 35, color: '#7C3AED' },
        { label: 'Extreme', value: 'extreme', xp: 50, color: '#5B21B6' },
    ];

    const taskTypes = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Custom', value: 'custom' },
    ];

    const selectedDifficulty = difficulties.find(d => d.value === taskDifficulty);

    const handleAddTask = () => {
        if (!taskName.trim()) return;

        const xpReward = selectedDifficulty?.xp || 10;

        onAddTask({
            name: taskName.trim(),
            description: taskDescription.trim(),
            type: taskType,
            difficulty: taskDifficulty,
            xp_reward: xpReward,
        });

        // Reset form
        setTaskName('');
        setTaskDescription('');
        setTaskType('daily');
        setTaskDifficulty('easy');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet">
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}>

                    {/* Header */}
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={styles.header}>
                        <Text style={styles.headerTitle}>Add New Quest</Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <X size={24} color="#FFFFFF" />
                        </Pressable>
                    </LinearGradient>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Task Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Quest Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={taskName}
                                onChangeText={setTaskName}
                                placeholder="Enter quest name..."
                                placeholderTextColor="#64748B"
                                maxLength={100}
                            />
                        </View>

                        {/* Task Description */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={taskDescription}
                                onChangeText={setTaskDescription}
                                placeholder="Describe your quest..."
                                placeholderTextColor="#64748B"
                                multiline
                                numberOfLines={3}
                                maxLength={300}
                            />
                        </View>

                        {/* Task Type */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Quest Type</Text>
                            <View style={styles.optionGrid}>
                                {taskTypes.map((type) => (
                                    <Pressable
                                        key={type.value}
                                        style={[
                                            styles.optionCard,
                                            taskType === type.value && styles.optionSelected
                                        ]}
                                        onPress={() => setTaskType(type.value)}>
                                        <Text style={[
                                            styles.optionText,
                                            taskType === type.value && styles.optionTextSelected
                                        ]}>
                                            {type.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        {/* Difficulty */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Difficulty & XP Reward</Text>
                            <View style={styles.difficultyGrid}>
                                {difficulties.map((difficulty) => (
                                    <Pressable
                                        key={difficulty.value}
                                        style={[
                                            styles.difficultyCard,
                                            taskDifficulty === difficulty.value && [
                                                styles.difficultySelected,
                                                { borderColor: difficulty.color }
                                            ]
                                        ]}
                                        onPress={() => setTaskDifficulty(difficulty.value)}>
                                        <LinearGradient
                                            colors={
                                                taskDifficulty === difficulty.value
                                                    ? [difficulty.color + '20', difficulty.color + '10']
                                                    : ['#1E293B', '#334155']
                                            }
                                            style={styles.difficultyGradient}>
                                            <Text style={[
                                                styles.difficultyName,
                                                taskDifficulty === difficulty.value && { color: difficulty.color }
                                            ]}>
                                                {difficulty.label}
                                            </Text>
                                            <Text style={styles.difficultyXP}>+{difficulty.xp} XP</Text>
                                        </LinearGradient>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Add Button */}
                    <View style={styles.footer}>
                        <Pressable
                            style={[
                                styles.addButton,
                                !taskName.trim() && styles.addButtonDisabled
                            ]}
                            onPress={handleAddTask}
                            disabled={!taskName.trim()}>
                            <LinearGradient
                                colors={
                                    taskName.trim()
                                        ? ['#3B82F6', '#2563EB']
                                        : ['#64748B', '#475569']
                                }
                                style={styles.addButtonGradient}>
                                <Plus size={20} color="#FFFFFF" />
                                <Text style={styles.addButtonText}>Add Quest</Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 16,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        color: '#E2E8F0',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    optionGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    optionSelected: {
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
    },
    optionText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '600',
    },
    optionTextSelected: {
        color: '#3B82F6',
    },
    difficultyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    difficultyCard: {
        flex: 1,
        minWidth: '45%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        overflow: 'hidden',
    },
    difficultySelected: {
        borderWidth: 2,
    },
    difficultyGradient: {
        padding: 16,
        alignItems: 'center',
    },
    difficultyName: {
        color: '#E2E8F0',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    difficultyXP: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        paddingTop: 12,
    },
    addButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    addButtonDisabled: {
        opacity: 0.6,
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        gap: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
