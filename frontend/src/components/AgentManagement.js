import React, { useState, useEffect } from 'react';
import { getAgents, createAgent } from '../api/agents';
import './AgentManagement.css'; // We'll create this for styling

const AgentManagement = () => {
    const [agents, setAgents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch agents when the component loads
    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const agentsData = await getAgents();
            setAgents(agentsData);
        } catch (err) {
            setError('Failed to fetch agents.');
        }
    };

    const { name, email, mobile, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await createAgent(formData);
            setMessage('Agent created successfully!');
            setFormData({ name: '', email: '', mobile: '', password: '' }); // Clear form
            fetchAgents(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create agent.');
        }
    };

    return (
        <div className="agent-management-container">
            <div className="add-agent-form">
                <h3>Add New Agent</h3>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={onSubmit}>
                    <input type="text" name="name" value={name} onChange={onChange} placeholder="Name" required />
                    <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                    <input type="text" name="mobile" value={mobile} onChange={onChange} placeholder="Mobile (e.g., +911234567890)" required />
                    <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                    <button type="submit">Add Agent</button>
                </form>
            </div>

            <div className="agent-list">
                <h3>Existing Agents</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map(agent => (
                            <tr key={agent._id}>
                                <td>{agent.name}</td>
                                <td>{agent.email}</td>
                                <td>{agent.mobile}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentManagement;