import { LinearGradient } from 'expo-linear-gradient';
import { Activity } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoadingScreen() {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Pulse animation for the icon
        const pulse = () => {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start(() => pulse());
        };

        pulse();
    }, [fadeAnim, pulseAnim]);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0F172A', '#1E293B', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}>

                <Animated.View
                    style={[
                        styles.content,
                        { opacity: fadeAnim }
                    ]}>

                    {/* Animated Icon */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            { transform: [{ scale: pulseAnim }] }
                        ]}>
                        <LinearGradient
                            colors={['#3B82F6', '#1D4ED8']}
                            style={styles.iconGradient}>
                            <Activity size={40} color="#FFFFFF" />
                        </LinearGradient>
                    </Animated.View>

                    {/* App Title */}
                    <Text style={styles.title}>Solo Arc</Text>
                    <Text style={styles.subtitle}>Real Life Level-up</Text>

                    {/* Loading Text */}
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Become the greatest version of yourself.</Text>

                        {/* Loading Dots */}
                        <View style={styles.dotsContainer}>
                            <LoadingDot delay={0} />
                            <LoadingDot delay={200} />
                            <LoadingDot delay={400} />
                        </View>
                    </View>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
}

function LoadingDot({ delay }: { delay: number }) {
    const dotAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(dotAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(dotAnim, {
                    toValue: 0.3,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => animate());
        };

        animate();
    }, [dotAnim, delay]);

    return (
        <Animated.View
            style={[
                styles.dot,
                { opacity: dotAnim }
            ]}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        marginBottom: 32,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 48,
        textAlign: 'center',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#E2E8F0',
        marginBottom: 20,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
        marginHorizontal: 4,
    },
});
