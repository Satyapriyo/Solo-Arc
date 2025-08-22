# XP System Documentation

## Standardized XP Values Across Solo Leveling App

### Task XP Rewards (Fixed Values)
- **Easy**: 10 XP
- **Medium**: 20 XP  
- **Hard**: 35 XP
- **Extreme**: 50 XP

### Workout XP Rewards (Dynamic Calculation)
- **Strength**: duration × 2.0
- **Cardio**: duration × 1.5
- **Flexibility**: duration × 1.0
- **Endurance**: duration × 2.5

### XP Calculation Logic

#### Adding XP (Task Completion/Workout):
1. Add to `total_xp`
2. Add to `current_xp`
3. Check for level up: if `current_xp >= 3000`
   - New level = floor(`total_xp / 3000`) + 1
   - New current_xp = `total_xp % 3000`

#### Removing XP (Task Unchecked):
1. Subtract from `total_xp` (minimum 0)
2. Recalculate everything based on new total:
   - New level = floor(`total_xp / 3000`) + 1 (minimum 1)
   - New current_xp = `total_xp % 3000`

### Implementation Files:

#### useProfile.tsx
- `addXP(amount)`: Adds XP and handles level ups
- `removeXP(amount)`: Removes XP and recalculates level/current XP

#### useTasks.ts  
- `toggleTask(taskId)`: 
  - ✅ Completing task: `addXP(task.xp_reward)`
  - ❌ Unchecking task: `removeXP(task.xp_reward)`

#### useWorkouts.ts
- `addWorkout(data)`: Adds XP based on workout duration and type

#### AddTaskModal.tsx
- Uses standardized difficulty → XP mapping
- Ensures consistency across all new tasks

### Database Consistency:
- Sample tasks updated to use standard XP values
- All XP calculations now consistent across components
- Level system: 3000 XP per level starting from level 1

### User Experience:
- ✅ Complete task → Gain XP → Possible level up
- ❌ Uncheck task → Lose XP → Possible level down
- 💪 Complete workout → Gain XP based on effort
- 🎯 Consistent reward system across all activities
