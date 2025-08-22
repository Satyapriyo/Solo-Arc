import { AuthScreen } from '@/components/AuthScreen';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthContext } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { SquareCheck as CheckSquare, Crown, Chrome as Home, TrendingUp, User } from 'lucide-react-native';
import { useContext } from 'react';
import { View } from 'react-native';

// Custom tab bar icon wrapper with active state styling
function TabBarIcon({ children, focused }: { children: React.ReactNode; focused: boolean }) {
  if (focused) {
    return (
      <LinearGradient
        colors={['#60A5FA20', '#3B82F610']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: 10,
          minWidth: 52,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#60A5FA',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 8,
        }}>
        {children}
      </LinearGradient>
    );
  }
  return (
    <View style={{
      padding: 10,
      minWidth: 52,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </View>
  );
}

export default function TabLayout() {
  const { state } = useContext(AuthContext);

  // Show loading screen while checking authentication
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  // Show auth screen if not authenticated
  if (!state.user) {
    return <AuthScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 4,
          height: 88,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -8,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 15,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        },
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 0,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          borderRadius: 0,
          marginHorizontal: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#0F172A', '#1E293B', '#0F172A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon focused={focused}>
              <Home size={size} color={color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Quests',
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon focused={focused}>
              <CheckSquare size={size} color={color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon focused={focused}>
              <TrendingUp size={size} color={color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon focused={focused}>
              <Crown size={size} color={color} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hunter',
          tabBarIcon: ({ size, color, focused }) => (
            <TabBarIcon focused={focused}>
              <User size={size} color={color} />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}