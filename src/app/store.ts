import { configureStore } from "@reduxjs/toolkit"
import childProfileReducer from "../features/childProfile/childProfileSlice"
import achievementsReducer from "../features/achievements/achievementsSlice"

const store = configureStore({
    reducer: {
        childProfile: childProfileReducer,
        achievements: achievementsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
