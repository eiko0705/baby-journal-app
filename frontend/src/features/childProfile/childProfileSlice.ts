import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { fetchProfileAPI, updateProfileAPI } from "../../services/profileService"
import type { ChildProfile } from "../../services/profileService"

interface ChildProfileState {
    profile: ChildProfile | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
    birthday: string | null
}

const initialState: ChildProfileState = {
    profile: null,
    status: 'idle',
    error: null,
    birthday: null
}

export const fetchProfile = createAsyncThunk<ChildProfile>(
    'childProfile/fetchProfile',
    async () => {
        const response = await fetchProfileAPI();
        return response;
    }
);

export const updateProfile = createAsyncThunk<ChildProfile, Omit<ChildProfile, 'id' | 'createdAt' | 'updatedAt'>>(
    'childProfile/updateProfile',
    async (profileData) => {
        const response = await updateProfileAPI(profileData);
        return response;
    }
);

export const childProfileSlice = createSlice({
    name: "childProfile",
    initialState,
    reducers: {
        setBirthday: (state, action: PayloadAction<string | null>) => {
            state.birthday = action.payload
            if (state.profile) {
                state.profile.birthday = action.payload || ''
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.profile = action.payload
                state.birthday = action.payload.birthday
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message || 'Failed to fetch profile'
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profile = action.payload
                state.birthday = action.payload.birthday
            })
    }
})

export const { setBirthday } = childProfileSlice.actions
export const selectBirthday = (state: RootState) => state.childProfile.birthday
export const selectProfile = (state: RootState) => state.childProfile.profile
export const selectProfileStatus = (state: RootState) => state.childProfile.status
export const selectProfileError = (state: RootState) => state.childProfile.error
export default childProfileSlice.reducer

