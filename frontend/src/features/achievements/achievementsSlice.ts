import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Achievement, NewAchievementPayload } from '../../types'

interface AchievementsState {
    items: Achievement[]
}

const initialState: AchievementsState = {
    items: []
}

export const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        addAchievement: (state, action: PayloadAction<NewAchievementPayload>) => {
            const newAchievement: Achievement = {
                id: nanoid(),
                ...action.payload,
            }
            state.items.push(newAchievement)
            state.items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        },
        removeAchievement: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(achievement => achievement.id !== action.payload)
        },
        updateAchievement: (state, action: PayloadAction<Achievement>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },
        /*
        setAchievementAge: (state, action: PayloadAction<Achievement>) => {
            const achievements = state.items.find(item => item.id === action.payload.id)
            if (achievements) {
                achievements.ageAtEvent = action.payload.ageAtEvent
            }
        }
        */
    }
})

export const { addAchievement, removeAchievement, updateAchievement } = achievementsSlice.actions
export const selectAllAchievements = (state: RootState) => state.achievements.items
export const selectAchievementById = (state: RootState, id: string) => state.achievements.items.find(item => item.id === id)

export default achievementsSlice.reducer
