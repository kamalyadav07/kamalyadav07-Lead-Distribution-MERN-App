import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AgentManagement from '../components/AgentManagement';
import LeadDistribution from '../components/LeadDistribution';
import LeadDisplay from '../components/LeadDisplay'; // Import the new component
import { getDistributedLeads } from '../api/leads'; // Import the new api function

const DashboardPage = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [leadsByAgent, setLeadsByAgent] = useState({});
    const [loadingLeads, setLoadingLeads] = useState(true);

    // Function to fetch leads
    const fetchLeads = async () => {
        setLoadingLeads(true);
        try {
            const data = await getDistributedLeads();
            setLeadsByAgent(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoadingLeads(false);
        }
    };

    // Fetch leads when the component mounts
    useEffect(() => {
        fetchLeads();
    }, []);

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
                
                {/* Pass the fetchLeads function so the component can trigger a refresh */}
                <LeadDistribution onUploadSuccess={fetchLeads} />

                {/* Pass the fetched data to the display component */}
                <LeadDisplay leadsByAgent={leadsByAgent} loading={loadingLeads} />
            </main>
        </div>
    );
};

export default DashboardPage;