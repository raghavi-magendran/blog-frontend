import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slice/authSlice';
import { RootState } from '../store';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    return (
        <div style={styles.navbar}>
            <div style={styles.navContent}>
                <div style={styles.brand}>My Blog</div>
                <div style={styles.navLinks}>
                    <Link to="/" style={styles.link}>Home</Link>
                    {isAuthenticated ? (
                        <>
                            <span style={styles.username}>{user?.name}</span>
                            <button onClick={() => dispatch(logout())} style={styles.button}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" style={styles.buttonLink}>Login</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#000', 
        padding: '1rem',
        color: '#fff', 
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
    },
    navContent: {
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    link: {
        color: '#fff', 
        textDecoration: 'none',
        fontSize: '1rem',
    },
    username: {
        fontSize: '1rem',
        marginRight: '1rem',
    },
    button: {
        backgroundColor: '#007bff', 
        color: '#fff', 
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    buttonLink: {
        backgroundColor: '#007bff', 
        color: '#fff',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontSize: '1rem',
    },
};

export default Navbar;
