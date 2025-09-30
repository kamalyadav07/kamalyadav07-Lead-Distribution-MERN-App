import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AgentManagement from '../components/AgentManagement';
import LeadDistribution from '../components/LeadDistribution'; // Import the new component

const DashboardPage = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <main className="dashboard-content">
                <AgentManagement />
                <LeadDistribution /> {/* Add the component here */}
            </main>
        </div>
    );
};

export default DashboardPage;