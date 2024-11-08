import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import Create from './components/post/Create';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails } from './slice/authSlice';
import { AppDispatch, RootState } from './store';
import PostDetails from './components/PostDetails';
import EditPost from './components/EditPost';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('access_token') && !isAuthenticated) {
            dispatch(fetchUserDetails());
        }
    }, [dispatch, isAuthenticated]);

    return (
        <div className="App">
            {isAuthenticated && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                
                {}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <Create />
                        </ProtectedRoute>
                    }
                />
                <Route path="/post/:postId" element={<PostDetails />} />
                <Route path="/edit/:postId" element={<EditPost />} />
            </Routes>
        </div>
    );
}

export default App;
