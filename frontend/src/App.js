import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage'; // <-- 1. IMPORT THE NEW PAGE
import { logoutUser, getCurrentUser } from './services/api';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        // This logic remains the same
        if (token) {
            getCurrentUser()
                .then(response => {
                    setCurrentUser(response.data);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    setIsAuthenticated(false);
                    setCurrentUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogout = async () => {
        // This logic remains the same
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed on server, but clearing client session.", error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setCurrentUser(null);
        }
    };

    const ProtectedRoute = ({ children }) => {
        // This logic remains the same
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div>
                <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
                    <div>
                        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                        {/* --- 2. ADD FRIENDS LINK TO NAV --- */}
                        {isAuthenticated && (
                             <Link to="/friends" style={{ marginRight: '10px' }}>Friends</Link>
                        )}
                    </div>
                    <div>
                        {isAuthenticated && currentUser ? (
                            <>
                                <span style={{ marginRight: '15px' }}>Welcome, {currentUser.name}!</span>
                                <Link to={`/profile/${currentUser.id}`} style={{ marginRight: '15px', textDecoration: 'none', color: '#0d6efd' }}>
                                    Profile
                                </Link>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </nav>

                <div style={{ padding: '20px' }}>
                    <Routes>
                        <Route
                            path="/"
                            element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                        />
                        <Route
                            path="/login"
                            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/register"
                            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
                        />
                        {/* Protected profile route */}
                        <Route 
                            path="/profile/:userId" 
                            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
                        />
                        
                        {/* --- 3. ADD THE FRIENDS PAGE ROUTE --- */}
                        <Route
                            path="/friends"
                            element={<ProtectedRoute><FriendsPage /></ProtectedRoute>}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;