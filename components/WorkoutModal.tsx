import { useWorkouts } from '@/hooks/useWorkouts';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell, Timer, X, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface WorkoutModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function WorkoutModal({ visible, onClose }: WorkoutModalProps) {
    const { addWorkout } = useWorkouts();
    const [workout, setWorkout] = useState({
        name: '',
        type: 'strength',
        duration: '',
    });
    const [loading, setLoading] = useState(false);

    const workoutTypes = [
        { id: 'strength', name: 'Strength', xpMultiplier: 2 },
        { id: 'cardio', name: 'Cardio', xpMultiplier: 1.5 },
        { id: 'flexibility', name: 'Flexibility', xpMultiplier: 1 },
        { id: 'endurance', name: 'Endurance', xpMultiplier: 2.5 },
    ];

    const handleStartWorkout = async () => {
        if (!workout.name.trim() || !workout.duration) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const duration = parseInt(workout.duration);
        if (isNaN(duration) || duration <= 0) {
            Alert.alert('Error', 'Please enter a valid duration');
            return;
        }

        setLoading(true);

        try {
            const selectedType = workoutTypes.find(t => t.id === workout.type);
            const xpEarned = Math.floor(duration * (selectedType?.xpMultiplier || 1));

            const result = await addWorkout({
                name: workout.name,
                type: workout.type,
                duration,
                xp_earned: xpEarned,
            });

            if (result?.error) {
                Alert.alert('Error', 'Failed to save workout');
            } else {
                Alert.alert(
                    'Workout Complete! 💪',
                    `You earned ${xpEarned} XP for your ${duration}-minute ${selectedType?.name.toLowerCase()} workout!`
                );
                setWorkout({ name: '', type: 'strength', duration: '' });
                onClose();
            }
        } catch (error) {
            console.error('Workout error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['#1E293B', '#334155']}
                        style={styles.modalContent}>

                        <View style={styles.modalHeader}>
                            <View style={styles.headerIcon}>
                                <Dumbbell size={24} color="#3B82F6" />
                            </View>
                            <Text style={styles.modalTitle}>Start Workout</Text>
                            <Pressable style={styles.closeButton} onPress={onClose}>
                                <X size={24} color="#94A3B8" />
                            </Pressable>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Workout Name</Text>
                            <TextInput
                                style={styles.formInput}
                                value={workout.name}
                                onChangeText={(text) => setWorkout({ ...workout, name: text })}
                                placeholder="e.g., Morning Push-ups"
                                placeholderTextColor="#64748B"
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Workout Type</Text>
                            <View style={styles.typeGrid}>
                                {workoutTypes.map((type) => (
                                    <Pressable
                                        key={type.id}
                                        style={[
                                            styles.typeButton,
                                            workout.type === type.id && styles.typeButtonActive
                                        ]}
                                        onPress={() => setWorkout({ ...workout, type: type.id })}>
                                        <Text style={[
                                            styles.typeButtonText,
                                            workout.type === type.id && styles.typeButtonTextActive
                                        ]}>
                                            {type.name}
                                        </Text>
                                        <Text style={styles.typeMultiplier}>
                                            {type.xpMultiplier}x XP
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Duration (minutes)</Text>
                            <View style={styles.durationContainer}>
                                <Timer size={20} color="#64748B" />
                                <TextInput
                                    style={styles.durationInput}
                                    value={workout.duration}
                                    onChangeText={(text) => setWorkout({ ...workout, duration: text })}
                                    placeholder="30"
                                    placeholderTextColor="#64748B"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {workout.duration && (
                            <View style={styles.xpPreview}>
                                <Zap size={16} color="#3B82F6" />
                                <Text style={styles.xpPreviewText}>
                                    Estimated XP: {Math.floor(parseInt(workout.duration || '0') *
                                        (workoutTypes.find(t => t.id === workout.type)?.xpMultiplier || 1))}
                                </Text>
                            </View>
                        )}

                        <Pressable
                            style={[styles.startButton, loading && styles.startButtonDisabled]}
                            onPress={handleStartWorkout}
                            disabled={loading}>
                            <LinearGradient
                                colors={loading ? ['#64748B', '#475569'] : ['#3B82F6', '#2563EB']}
                                style={styles.startButtonGradient}>
                                <Dumbbell size={20} color="#FFFFFF" />
                                <Text style={styles.startButtonText}>
                                    {loading ? 'Saving...' : 'Complete Workout'}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalContent: {
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerIcon: {
        marginRight: 12,
    },
    modalTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        color: '#E2E8F0',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    formInput: {
        backgroundColor: '#374151',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeButton: {
        flex: 1,
        minWidth: '45%',
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#374151',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    typeButtonActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#60A5FA',
    },
    typeButtonText: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    typeButtonTextActive: {
        color: '#FFFFFF',
    },
    typeMultiplier: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '500',
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#374151',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4B5563',
        paddingLeft: 16,
    },
    durationInput: {
        flex: 1,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
    },
    xpPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B98120',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    xpPreviewText: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    startButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    startButtonDisabled: {
        opacity: 0.6,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});