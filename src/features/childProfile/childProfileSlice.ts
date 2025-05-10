import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"

interface ChildProfileState {
    birthday: string | null
}

const initialState: ChildProfileState = {
    birthday: null
}

export const childProfileSlice = createSlice({
    name: "childProfile",
    initialState,
    reducers: {
        setBirthday: (state, action: PayloadAction<string | null>) => {
            state.birthday = action.payload
        }
    }
})

export const { setBirthday } = childProfileSlice.actions
export const selectBirthday = (state: RootState) => state.childProfile.birthday
export default childProfileSlice.reducer

