import React from 'react';
import './LeadDisplay.css';

const LeadDisplay = ({ leadsByAgent, loading }) => {
    if (loading) {
        return <p>Loading leads...</p>;
    }

    const agentNames = Object.keys(leadsByAgent);

    if (agentNames.length === 0) {
        return (
            <div className="lead-display-container">
                <h3>Distributed Leads</h3>
                <p>No leads have been distributed yet. Upload a file to see the results.</p>
            </div>
        );
    }

    return (
        <div className="lead-display-container">
            <h3>Distributed Leads</h3>
            <div className="agents-grid">
                {agentNames.map(agentName => (
                    <div key={agentName} className="agent-leads-card">
                        <h4>{agentName}'s Leads</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Phone</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leadsByAgent[agentName].map(lead => (
                                    <tr key={lead._id}>
                                        <td>{lead.firstName}</td>
                                        <td>{lead.phone}</td>
                                        <td>{lead.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeadDisplay;