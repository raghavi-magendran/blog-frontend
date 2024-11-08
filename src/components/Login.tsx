import React, { useState, CSSProperties } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slice/authSlice';
import { AppDispatch, RootState } from '../store';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ username, password }));
        if (loginUser.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Blog Page - Login</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#00072D', 
    },
    formContainer: {
        backgroundColor: '#000', 
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center' as 'center', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    },
    title: {
        color: '#fff', 
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column', 
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    label: {
        color: '#fff',
        marginBottom: '0.5rem',
        display: 'block',
        textAlign: 'left' as 'left', 
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #555', 
        backgroundColor: '#333',
        color: '#e0e0e0', 
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        borderRadius: '4px',
        backgroundColor: '#123499', 
        color: '#fff',
        fontSize: '1rem',
        border: 'none',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    error: {
        color: '#ff4d4d', 
        marginTop: '1rem',
    },
};

export default Login;
