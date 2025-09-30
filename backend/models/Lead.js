const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    phone: {
        type: String, // Using String to accommodate different formats like '+91...'
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Agent', // This creates a relationship to the Agent model
        required: true
    },
    // Adding a status can be useful for tracking
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Closed'],
        default: 'New'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);