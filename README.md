# Solo Ark 🗡️⚡

A gamified fitness and productivity app inspired by Solo Leveling, built with React Native and Expo. Transform your daily tasks and workouts into an RPG-style progression system where you level up, gain XP, and build your hunter profile!

## ✨ Features
<p style="display: flex; justify-content: space-between; margin: 20px 0;" align="center" >
  <img src="https://res.cloudinary.com/duyocx2j0/image/upload/v1755926611/WhatsApp_Image_2025-08-23_at_10.51.42_5495f1ac_tcyruk.jpg" width="200" />
  <img src="https://res.cloudinary.com/duyocx2j0/image/upload/v1755926610/WhatsApp_Image_2025-08-23_at_10.51.41_1e891fb3_bnx71t.jpg" width="200"/>
  <img src="https://res.cloudinary.com/duyocx2j0/image/upload/v1755926611/WhatsApp_Image_2025-08-23_at_10.51.41_edb51dd1_inypgx.jpg" width="200" />
</p>

<p style="display: flex; justify-content: space-around; margin: 20px 0;" align="center">
  <img src="https://res.cloudinary.com/duyocx2j0/image/upload/v1755926611/WhatsApp_Image_2025-08-23_at_10.51.41_cabab093_p5w4pt.jpg" width="200" />
  <img src="https://res.cloudinary.com/duyocx2j0/image/upload/v1755926610/WhatsApp_Image_2025-08-23_at_10.51.40_7265e876_rrhmhj.jpg" width="200" />
</p>

### 🎮 Gamification System
- **Hunter Profile**: Level up system with XP progression
- **Stats Tracking**: Strength, Endurance, Discipline, and Daily Streaks
- **XP Rewards**: Earn 10-50 XP for completing tasks and workouts
- **Leaderboard**: Compete with other hunters globally

### 📱 Core Functionality
- **Daily Quests**: Create and manage daily tasks with custom XP rewards
- **Workout System**: Track workouts with different XP multipliers
  - Strength: 2x XP multiplier
  - Endurance: 2.5x XP multiplier  
  - Cardio: 1.5x XP multiplier
  - Flexibility: 1x XP multiplier
- **Progress Tracking**: Visual progress bars and achievement system
- **Streak System**: Maintain daily completion streaks

### 🔐 Authentication & Data
- **Civic Auth Integration**: Secure OAuth2 authentication
- **Supabase Backend**: Real-time data sync and storage
- **Profile Management**: Persistent user progress and stats

### 🎨 Modern UI/UX
- **Blue-Violet Theme**: Consistent design language throughout
- **Gradient Backgrounds**: Modern visual effects with LinearGradient
- **Tab Navigation**: Intuitive bottom tab navigation
- **Responsive Design**: Works on various screen sizes

## 🚀 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Civic Auth (OAuth2)
- **Navigation**: Expo Router with file-based routing
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: React Native StyleSheet with LinearGradient

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Supabase account
- Civic Auth account

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Satyapriyo/Solo-Arc.git
   cd Solo_leveling_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_CLIENTID=your_civic_auth_client_id
   EXPO_PUBLIC_CIVIC_AUTH_URL=https://auth.civic.com/oauth
   EXPO_PUBLIC_APP_SCHEME=civicauthmobile
   ```

4. **Database Setup**
   - Create a Supabase project
   - Run the database migrations (see DEPLOY_INSTRUCTIONS.md)
   - Set up the required tables: profiles, tasks, workouts

5. **Start the development server**
   ```bash
   npx expo start
   ```

## 📱 Running the App

In the output, you'll find options to open the app in:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) (limited sandbox)

## 🏗️ Project Structure

```
app/
├── (tabs)/              # Tab-based navigation screens
│   ├── index.tsx        # Dashboard/Home screen
│   ├── tasks.tsx        # Task management
│   ├── progress.tsx     # Progress tracking
│   ├── leaderboard.tsx  # Global leaderboard
│   └── profile.tsx      # User profile
├── _layout.tsx          # Root layout with providers
└── +not-found.tsx       # 404 screen

components/
├── AuthScreen.tsx       # Authentication interface
├── WorkoutModal.tsx     # Workout creation modal
├── AddTaskModal.tsx     # Task creation modal
└── ui/                  # Reusable UI components

hooks/
├── useProfile.tsx       # Profile management
├── useTasks.ts         # Task operations
├── useWorkouts.ts      # Workout operations
└── useLeaderboard.ts   # Leaderboard data

contexts/
└── AuthContext.tsx     # Authentication state management

lib/
└── supabase.ts         # Supabase client configuration
```

## 🎯 Key Features Usage

### Creating Daily Quests
1. Navigate to Dashboard
2. Tap "Add Task" button
3. Fill in task details and XP reward (10-50 XP)
4. Complete tasks to earn XP and maintain streaks

### Starting Workouts
1. Tap "Start Workout" on Dashboard
2. Choose workout type (affects XP multiplier)
3. Set duration and name
4. Complete workout to earn XP based on duration × multiplier

### Tracking Progress
- View your level, current XP, and stats on Dashboard
- Check detailed progress charts on Progress tab
- Monitor your ranking on Leaderboard tab

## 🔧 Development Commands

```bash
# Start development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android

# Build for production
npx expo build

# Reset project (if needed)
npm run reset-project
```

## 📚 Documentation

For more detailed information:
- [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) - Database setup and deployment
- [Expo documentation](https://docs.expo.dev/)
- [Supabase documentation](https://supabase.com/docs)
- [Civic Auth documentation](https://docs.civic.com/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the Solo Leveling manhwa/anime
- Built with Expo and React Native
- Powered by Supabase and Civic Auth
