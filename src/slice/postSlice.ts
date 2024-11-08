import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { selectAuthToken } from './authSlice';
interface Post {
    _id: string;
    title: string;
    author: string;
    description: string;
}
interface PostsState {
    posts: Post[];
    loading: boolean;
    error: string | undefined;
}

const initialState: PostsState = {
    posts: [],
    loading: false,
    error: undefined,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:1116/blog/posts');
        return response.data;
    } catch (error) {
        return rejectWithValue('Error fetching posts');
    }
});
export const deletePost = createAsyncThunk('posts/deletePost', async (postId: string, { rejectWithValue }) => {
    const token = useSelector(selectAuthToken);
    if (!token) return rejectWithValue('No token found');

    try {
        await axios.delete(`http://localhost:1116/blog/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return postId;
    } catch (error) {
        return rejectWithValue('Error deleting post');
    }
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter(post => post._id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});
export default postsSlice.reducer;
