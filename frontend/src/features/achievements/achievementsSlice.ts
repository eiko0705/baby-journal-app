import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Achievement, NewAchievementPayload } from '../../types'
import { createAchievemntAPI, fetchAchievementsAPI } from '../../services/achievementService'

interface AchievementsState {
    items: Achievement[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: AchievementsState = {
    items: [],
    status: 'idle',
    error: null,
}

export const fetchAchievements = createAsyncThunk<Achievement[]>(
    'achievements/fetchAchievements',
    async () => {
        const response = await fetchAchievementsAPI();
        return response
    }
)

export const addNewAchievement = createAsyncThunk<Achievement, NewAchievementPayload>(
    'achievements/addNewAchievemnt',
    async (newAchievementData) => {
        const response = await createAchievemntAPI(newAchievementData)
        return response
    }
)

export const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        removeAchievement: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(achievement => achievement.id !== action.payload)
        },
        updateAchievement: (state, action: PayloadAction<Achievement>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id)
            if (index !== -1) {
                state.items[index] = action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAchievements.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchAchievements.fulfilled, (state, action: PayloadAction<Achievement[]>) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchAchievements.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to fetch achievements'
            })
            .addCase(addNewAchievement.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(addNewAchievement.fulfilled, (state, action: PayloadAction<Achievement>) => {
                state.status = 'succeeded'
                state.items.push(action.payload)
            })
            .addCase(addNewAchievement.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to add new achievements'
            })
        }
})

export const { removeAchievement, updateAchievement } = achievementsSlice.actions
export const selectAllAchievements = (state: RootState) => state.achievements.items
export const selectAchievementsStatus = (state: RootState) => state.achievements.status
export const selectAchievementsError = (state: RootState) => state.achievements.error
export const selectAchievementById = (state: RootState, id: string) => state.achievements.items.find(item => item.id === id)

export default achievementsSlice.reducer
