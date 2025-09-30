import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    // Show a loading indicator while checking auth status
    if (loading) {
        return <div>Loading...</div>;
    }

    // If authenticated, render the child route.
    // The <Outlet /> component from react-router-dom is a placeholder 
    // for the nested child route to be rendered.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;