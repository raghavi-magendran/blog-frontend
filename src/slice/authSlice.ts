import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('access_token') || null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/login`, {
                username,
                password,
            });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            return access_token;
        } catch (error) {
            return rejectWithValue('Invalid username or password');
        }
    }
);

export const fetchUserDetails = createAsyncThunk(
    'auth/fetchUserDetails',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const token = state.auth.token || localStorage.getItem('access_token');
        if (!token) return rejectWithValue('No token found');

        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data as User;
        } catch (error) {
            return rejectWithValue('Failed to fetch user details');
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('access_token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload as string;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.token = null;
                state.error = action.payload as string;
            })
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.user = action.payload as User;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
