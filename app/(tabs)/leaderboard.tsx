import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useProfile } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Medal, Trophy, Zap } from 'lucide-react-native';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
    const { leaderboard, loading, refetch } = useLeaderboard();
    const { profile } = useProfile();

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown size={24} color="#60A5FA" />;
            case 2: return <Trophy size={24} color="#8B5CF6" />;
            case 3: return <Medal size={24} color="#7C3AED" />;
            default: return <Text style={styles.rankNumber}>#{rank}</Text>;
        }
    };

    const getRankGradient = (rank: number): [string, string] => {
        switch (rank) {
            case 1: return ['#60A5FA', '#3B82F6'];
            case 2: return ['#8B5CF6', '#7C3AED'];
            case 3: return ['#7C3AED', '#5B21B6'];
            default: return ['#1E293B', '#334155'];
        }
    };

    const userRank = leaderboard.findIndex(entry => entry.id === profile?.id) + 1;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refetch} />
                }>

                {/* Header */}
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}>
                    <Crown size={32} color="#FFFFFF" />
                    <Text style={styles.headerTitle}>Hunter Leaderboard</Text>
                    <Text style={styles.headerSubtitle}>Elite Hunter Rankings</Text>
                </LinearGradient>

                {/* User Rank Card */}
                {profile && userRank > 0 && (
                    <View style={styles.userRankSection}>
                        <Text style={styles.sectionTitle}>Your Ranking</Text>
                        <View style={styles.userRankCard}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.userRankGradient}>
                                <View style={styles.userRankContent}>
                                    <View style={styles.userRankLeft}>
                                        <Text style={styles.userRankPosition}>#{userRank}</Text>
                                        <View>
                                            <Text style={styles.userRankName}>{profile.name}</Text>
                                            <Text style={styles.userRankLevel}>Level {profile.level}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.userRankRight}>
                                        <Zap size={20} color="#FFFFFF" />
                                        <Text style={styles.userRankXP}>
                                            {profile.total_xp.toLocaleString()} XP
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                )}

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <View style={styles.podiumSection}>
                        <Text style={styles.sectionTitle}>Elite Hunters</Text>
                        <View style={styles.podium}>
                            {/* Second Place */}
                            <View style={[styles.podiumPlace, styles.secondPlace]}>
                                <LinearGradient
                                    colors={['#8B5CF6', '#7C3AED']}
                                    style={styles.podiumGradient}>
                                    <Trophy size={20} color="#FFFFFF" />
                                    <Text style={styles.podiumRank}>#2</Text>
                                    <Text style={styles.podiumName}>{leaderboard[1]?.name}</Text>
                                    <Text style={styles.podiumLevel}>Lv.{leaderboard[1]?.level}</Text>
                                    <Text style={styles.podiumXP}>
                                        {leaderboard[1]?.total_xp.toLocaleString()}
                                    </Text>
                                </LinearGradient>
                            </View>

                            {/* First Place */}
                            <View style={[styles.podiumPlace, styles.firstPlace]}>
                                <LinearGradient
                                    colors={['#60A5FA', '#3B82F6']}
                                    style={styles.podiumGradient}>
                                    <Crown size={24} color="#FFFFFF" />
                                    <Text style={styles.podiumRank}>#1</Text>
                                    <Text style={styles.podiumName}>{leaderboard[0]?.name}</Text>
                                    <Text style={styles.podiumLevel}>Lv.{leaderboard[0]?.level}</Text>
                                    <Text style={styles.podiumXP}>
                                        {leaderboard[0]?.total_xp.toLocaleString()}
                                    </Text>
                                </LinearGradient>
                            </View>

                            {/* Third Place */}
                            <View style={[styles.podiumPlace, styles.thirdPlace]}>
                                <LinearGradient
                                    colors={['#7C3AED', '#5B21B6']}
                                    style={styles.podiumGradient}>
                                    <Medal size={20} color="#FFFFFF" />
                                    <Text style={styles.podiumRank}>#3</Text>
                                    <Text style={styles.podiumName}>{leaderboard[2]?.name}</Text>
                                    <Text style={styles.podiumLevel}>Lv.{leaderboard[2]?.level}</Text>
                                    <Text style={styles.podiumXP}>
                                        {leaderboard[2]?.total_xp.toLocaleString()}
                                    </Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                )}

                {/* Full Rankings */}
                <View style={styles.rankingsSection}>
                    <Text style={styles.sectionTitle}>All Hunters</Text>
                    <View style={styles.rankingsList}>
                        {leaderboard.map((entry) => (
                            <View
                                key={entry.id}
                                style={[
                                    styles.rankingCard,
                                    entry.id === profile?.id && styles.currentUserCard
                                ]}>
                                <LinearGradient
                                    colors={getRankGradient(entry.rank)}
                                    style={styles.rankingGradient}>

                                    <View style={styles.rankingContent}>
                                        <View style={styles.rankingLeft}>
                                            <View style={styles.rankIcon}>
                                                {getRankIcon(entry.rank)}
                                            </View>
                                            <View style={styles.rankingInfo}>
                                                <Text style={[
                                                    styles.rankingName,
                                                    entry.id === profile?.id && styles.currentUserName
                                                ]}>
                                                    {entry.name}
                                                    {entry.id === profile?.id && ' (You)'}
                                                </Text>
                                                <Text style={styles.rankingLevel}>Level {entry.level}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.rankingRight}>
                                            <View style={styles.xpContainer}>
                                                <Zap size={16} color="#3B82F6" />
                                                <Text style={styles.rankingXP}>
                                                    {entry.total_xp.toLocaleString()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        padding: 24,
        paddingTop: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 12,
    },
    headerSubtitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 4,
        opacity: 0.9,
    },
    userRankSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    userRankCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    userRankGradient: {
        padding: 16,
    },
    userRankContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userRankLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRankPosition: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 16,
    },
    userRankName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userRankLevel: {
        color: '#E2E8F0',
        fontSize: 14,
        fontWeight: '500',
    },
    userRankRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRankXP: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    podiumSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    podium: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 200,
    },
    podiumPlace: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    firstPlace: {
        height: 160,
    },
    secondPlace: {
        height: 140,
    },
    thirdPlace: {
        height: 120,
    },
    podiumGradient: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    podiumRank: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    podiumName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
    },
    podiumLevel: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.8,
        marginTop: 2,
    },
    podiumXP: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '500',
        marginTop: 4,
    },
    rankingsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    rankingsList: {
        gap: 8,
    },
    rankingCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    currentUserCard: {
        borderWidth: 2,
        
    },
    rankingGradient: {
        padding: 16,
    },
    rankingContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rankingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rankIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rankNumber: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rankingInfo: {
        flex: 1,
    },
    rankingName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    currentUserName: {
        color: 'white',
    },
    rankingLevel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    rankingRight: {
        alignItems: 'flex-end',
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankingXP: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 4,
    },
});