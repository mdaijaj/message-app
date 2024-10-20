import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './component/register';
import Login from './component/login';
import Dashboard from './component/dashboard';
import Message from './component/message';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <Router>
            <div className="container mt-4">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/message/:userId" element={<PrivateRoute><Message /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('user');
    console.log("isAuthenticated", isAuthenticated)
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
