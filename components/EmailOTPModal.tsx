import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface EmailOTPModalProps {
    visible: boolean;
    email: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EmailOTPModal({ visible, email, onClose, onSuccess }: EmailOTPModalProps) {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const verifyOTP = async () => {
        if (!otp || otp.length < 4) {
            Alert.alert('Error', 'Please enter the confirmation code');
            return;
        }

        setLoading(true);
        try {
            // Try different verification methods
            let verificationSuccess = false;

            // Method 1: Try as 6-digit OTP
            if (otp.length === 6 && /^\d{6}$/.test(otp)) {
                const { error: otpError } = await supabase.auth.verifyOtp({
                    email,
                    token: otp,
                    type: 'email',
                });

                if (!otpError) {
                    verificationSuccess = true;
                }
            }

            // Method 2: Try as token hash (for email links)
            if (!verificationSuccess && otp.length > 6) {
                const { error: hashError } = await supabase.auth.verifyOtp({
                    token_hash: otp,
                    type: 'email',
                });

                if (!hashError) {
                    verificationSuccess = true;
                }
            }

            if (verificationSuccess) {
                Alert.alert('Success', 'Email verified successfully!');
                onSuccess();
                onClose();
            } else {
                Alert.alert(
                    'Verification Failed',
                    'Invalid code. Please check your email and try again, or copy the long token from the email link.'
                );
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setResendLoading(true);
        try {
            // Try to request OTP instead of email link
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: email,
            });

            if (otpError) {
                // Fallback to resend signup email
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                });

                if (error) {
                    Alert.alert('Error', error.message);
                } else {
                    Alert.alert('Sent', 'New confirmation sent! Check your email for the link and copy the token.');
                }
            } else {
                Alert.alert('OTP Sent', 'A 6-digit code has been sent to your email!');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            Alert.alert('Error', 'Failed to resend code');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <LinearGradient
                    colors={['#0F172A', '#1E293B']}
                    style={styles.modal}
                >
                    <Text style={styles.title}>Verify Your Email</Text>
                    <Text style={styles.subtitle}>
                        Check your email for a confirmation code{'\n'}or copy the token from the confirmation link
                    </Text>

                    <TextInput
                        style={styles.otpInput}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter code or token"
                        placeholderTextColor="#64748B"
                        keyboardType="default"
                        maxLength={200}
                        textAlign="center"
                        multiline={otp.length > 20}
                        numberOfLines={otp.length > 20 ? 3 : 1}
                    />                    <LinearGradient
                        colors={['#3B82F6', '#1E40AF']}
                        style={styles.button}
                    >
                        <Pressable
                            onPress={verifyOTP}
                            disabled={loading}
                            style={styles.buttonPress}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </Text>
                        </Pressable>
                    </LinearGradient>

                    <Pressable
                        onPress={resendOTP}
                        disabled={resendLoading}
                        style={styles.resendButton}
                    >
                        <Text style={styles.resendText}>
                            {resendLoading ? 'Sending...' : "Didn't receive code? Resend"}
                        </Text>
                    </Pressable>

                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>Cancel</Text>
                    </Pressable>
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        margin: 20,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '90%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 30,
        textAlign: 'center',
        lineHeight: 22,
    },
    otpInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
        letterSpacing: 8,
    },
    button: {
        borderRadius: 15,
        width: '100%',
        marginBottom: 15,
    },
    buttonPress: {
        padding: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendButton: {
        padding: 10,
        marginBottom: 10,
    },
    resendText: {
        color: '#3B82F6',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    closeButton: {
        padding: 10,
    },
    closeText: {
        color: '#64748B',
        fontSize: 14,
    },
});
