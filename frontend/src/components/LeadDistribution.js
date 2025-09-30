import React, { useState } from 'react';
import { uploadLeads } from '../api/leads';
import './LeadDistribution.css';

const LeadDistribution = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setUploading(true);
        setMessage('');
        setError('');

        try {
            const response = await uploadLeads(file);
            setMessage(response.message);
            setFile(null); // Clear the file input after successful upload
            e.target.reset(); // Resets the form including the file input
            
            // This is the new line: it calls the function passed from the dashboard
            // to trigger a refresh of the leads list.
            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (err) {
            setError(err.response?.data?.message || 'File upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="lead-distribution-container">
            <h3>Upload and Distribute Leads</h3>
            <p>Upload a .csv, .xls, or .xlsx file with columns: FirstName, Phone, Notes.</p>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept=".csv, .xls, .xlsx" />
                <button type="submit" disabled={uploading || !file}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LeadDistribution;