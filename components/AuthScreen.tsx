import { AuthContext } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Sword, Zap } from "lucide-react-native";
import React, { useContext } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthButtonProps {
    onPress: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

function AuthButton({ onPress, disabled = false, children }: AuthButtonProps) {
    return (
        <Pressable
            style={[styles.button, disabled && styles.buttonDisabled]}
            onPress={disabled ? undefined : onPress}
            disabled={disabled}
        >
            <LinearGradient
                colors={disabled ? ['#64748B', '#475569'] : ['#1E40AF', '#3730A3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
            >
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
                    {children}
                </Text>
            </LinearGradient>
        </Pressable>
    );
}

interface AuthScreenProps {
    onAuthSuccess?: () => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
    const { state, signIn, signOut } = useContext(AuthContext);

    const handleSignIn = async () => {
        try {
            signIn();
            onAuthSuccess?.();
        } catch (error) {
            console.error('Sign in error:', error);
            Alert.alert(
                "Authentication Error",
                "Failed to sign in with Civic Auth. Please try again.",
                [{ text: "OK" }],
            );
        }
    };

    const handleSignOut = async () => {
        try {
            signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            Alert.alert("Sign Out Error", "Failed to sign out. Please try again.", [
                { text: "OK" },
            ]);
        }
    };

    if (state.isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Zap size={48} color="#3B82F6" />
                    <Text style={styles.loadingText}>Awakening Hunter...</Text>
                    <Text style={styles.loadingSubtext}>Connecting to Civic Auth</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (state.isAuthenticated && state.user) {
        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Text style={styles.welcomeTitle}>Hunter Awakened!</Text>
                    <Text style={styles.welcomeSubtitle}>
                        {state.user.name || state.user.email || "Authenticated Hunter"}
                    </Text>
                    {state.user.email && (
                        <Text style={styles.emailText}>{state.user.email}</Text>
                    )}
                </LinearGradient>

                <View style={styles.buttonContainer}>
                    <AuthButton onPress={handleSignOut}>Sign Out</AuthButton>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Hero Section */}
            <LinearGradient
                colors={['#1E40AF', '#3730A3', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroSection}
            >
                <View style={styles.heroIcon}>
                    <Sword size={64} color="#FFFFFF" />
                </View>
                <Text style={styles.heroTitle}>Solo Leveling</Text>
                <Text style={styles.heroSubtitle}>Real Life RPG Adventure</Text>
                <Text style={styles.heroDescription}>
                    Transform your daily life into an epic quest. Level up by completing tasks,
                    building habits, and becoming the hero of your own story.
                </Text>
            </LinearGradient>

            {/* Features */}
            <View style={styles.featuresSection}>
                <View style={styles.feature}>
                    <View style={styles.featureIcon}>
                        <Zap size={24} color="#60A5FA" />
                    </View>
                    <View style={styles.featureContent}>
                        <Text style={styles.featureTitle}>Gain XP & Level Up</Text>
                        <Text style={styles.featureDescription}>
                            Complete tasks and workouts to earn experience points
                        </Text>
                    </View>
                </View>

                <View style={styles.feature}>
                    <View style={styles.featureIcon}>
                        <Sword size={24} color="#3B82F6" />
                    </View>
                    <View style={styles.featureContent}>
                        <Text style={styles.featureTitle}>Build Your Stats</Text>
                        <Text style={styles.featureDescription}>
                            Strengthen your discipline, endurance, and willpower
                        </Text>
                    </View>
                </View>
            </View>

            {/* Sign In Button */}
            <View style={styles.bottomSection}>
                <AuthButton onPress={handleSignIn} disabled={state.isLoading}>
                    {state.isLoading ? "Connecting..." : "Begin Your Journey"}
                </AuthButton>
                <Text style={styles.disclaimerText}>
                    Secure authentication powered by Civic
                </Text>
            </View>
        </SafeAreaView>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    loadingSubtext: {
        color: '#94A3B8',
        fontSize: 14,
        marginTop: 8,
    },
    header: {
        padding: 32,
        paddingTop: 48,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    welcomeTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emailText: {
        color: '#E2E8F0',
        fontSize: 14,
        opacity: 0.8,
    },
    heroSection: {
        padding: 32,
        paddingTop: 48,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 32,
    },
    heroIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        color: '#E2E8F0',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    heroDescription: {
        color: '#E2E8F0',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        opacity: 0.9,
        maxWidth: 300,
    },
    featuresSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    featureDescription: {
        color: '#94A3B8',
        fontSize: 14,
        lineHeight: 20,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    button: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonTextDisabled: {
        color: '#94A3B8',
    },
    disclaimerText: {
        color: '#64748B',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 16,
    },
});
