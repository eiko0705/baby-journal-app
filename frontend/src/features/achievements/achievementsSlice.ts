import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Achievement, NewAchievementPayload } from '../../types'
import { createAchievemntAPI, fetchAchievementsAPI, deleteAchievementAPI, updateAchievementAPI, uploadPhotoAPI } from '../../services/achievementService'

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

export const deleteAchievement = createAsyncThunk<string, string>(
    'achievements/deleteAchievement',
    async (id: string) => {
        const response = await deleteAchievementAPI(id)
        return response.id
    }
)

export const updateAchievement = createAsyncThunk<Achievement, { id: string, achievementData: NewAchievementPayload}>(
    'achievements/updateAchievement',
    async ({ id, achievementData }) => {
        const response = await updateAchievementAPI(id, achievementData)
        return response
    }
)

export const uploadPhoto = createAsyncThunk<Achievement, { id: string, photoFile: File }>(
    'achievements/uploadPhoto',
    async ({ id, photoFile }) => {
        const response = await uploadPhotoAPI(id, photoFile)
        return response
    }
)

export const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {},
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
            .addCase(deleteAchievement.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(deleteAchievement.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded'
                state.items = state.items.filter(item => item.id !== action.payload)
            })
            .addCase(deleteAchievement.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to delete achievement'
            })
            .addCase(updateAchievement.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(updateAchievement.fulfilled, (state, action: PayloadAction<Achievement>) => {
                state.status = 'succeeded'
                const updatedAchievement = action.payload
                const index = state.items.findIndex(item => item.id === updatedAchievement.id)
                if (index !== -1) {
                    state.items[index] = updatedAchievement
                }
                state.items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            })
            .addCase(updateAchievement.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to update achievement'
            })
            .addCase(uploadPhoto.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<Achievement>) => {
                state.status = 'succeeded'
                const updatedAchievement = action.payload
                const index = state.items.findIndex(item => item.id === updatedAchievement.id)
                if (index !== -1) {
                    state.items[index] = updatedAchievement
                }
            })
            .addCase(uploadPhoto.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to upload photo'
            })
        }
})

export const selectAllAchievements = (state: RootState) => state.achievements.items
export const selectAchievementsStatus = (state: RootState) => state.achievements.status
export const selectAchievementsError = (state: RootState) => state.achievements.error
export const selectAchievementById = (state: RootState, id: string) => state.achievements.items.find(item => item.id === id)

export default achievementsSlice.reducer
