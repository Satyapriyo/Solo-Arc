import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export default function DeepLinkHandler() {
    useEffect(() => {
        const handleDeepLink = async (url: string) => {
            console.log('Deep link received:', url);

            if (url.includes('auth/confirm') || url.includes('#access_token=') || url.includes('token_hash=')) {
                try {
                    // For email confirmation, we need to handle the token from the URL
                    const urlParams = new URLSearchParams(url.split('#')[1] || url.split('?')[1]);
                    const tokenHash = urlParams.get('token_hash');

                    if (tokenHash) {
                        // Verify the OTP token
                        const { data, error } = await supabase.auth.verifyOtp({
                            token_hash: tokenHash,
                            type: 'email',
                        });

                        if (error) {
                            console.error('Email verification error:', error);
                            Alert.alert(
                                'Confirmation Failed',
                                'The confirmation link has expired or is invalid. Please request a new confirmation email.',
                                [{ text: 'OK' }]
                            );
                        } else {
                            console.log('Email verified successfully:', data);
                            Alert.alert(
                                'Success!',
                                'Your email has been confirmed! You can now use the app.',
                                [{ text: 'OK' }]
                            );
                        }
                    } else {
                        // Fallback: just check if we have a valid session
                        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                        if (sessionData.session && !sessionError) {
                            Alert.alert(
                                'Success!',
                                'Your email has been confirmed! You can now use the app.',
                                [{ text: 'OK' }]
                            );
                        }
                    }
                } catch (error) {
                    console.error('Error handling deep link:', error);
                    Alert.alert('Error', 'Failed to process confirmation link. Please try again.');
                }
            }
        };

        // Handle the initial URL if the app was opened via deep link
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink(url);
            }
        });

        // Listen for deep links when the app is already running
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        return () => {
            subscription?.remove();
        };
    }, []);

    return null; // This component doesn't render anything
}
