import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import childProfileReducer from "../features/childProfile/childProfileSlice"
import achievementsReducer from "../features/achievements/achievementsSlice"

const persistConfig = {
    key: 'root',      // 保存される際のキー
    storage,          // 使用するストレージ（ここではlocalStorage）
    whitelist: ['childProfile'], // 永続化したいスライスの名前を配列で指定
}

const rootReducer = combineReducers({
    childProfile: childProfileReducer,
    achievements: achievementsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            // redux-persistのアクションをシリアライズチェックの対象外にする
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
