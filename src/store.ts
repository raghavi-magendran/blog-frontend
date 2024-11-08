import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import postReducer from './slice/postSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


