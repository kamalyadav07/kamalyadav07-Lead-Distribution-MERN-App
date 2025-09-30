const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const stream = require('stream');

const Agent = require('../models/Agent');
const Lead = require('../models/Lead');

// --- Multer Configuration for File Upload ---

// Define allowed file types
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'text/csv' || // .csv
        file.mimetype === 'application/vnd.ms-excel' || // .xls
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only CSV, XLS, and XLSX are allowed.'), false);
    }
};

// Use memory storage to process the file without saving it to disk
const storage = multer.memoryStorage();
exports.upload = multer({ storage: storage, fileFilter: fileFilter });


// --- Upload and Distribute Leads Logic ---

// @desc    Upload a CSV/Excel and distribute leads
// @route   POST /api/leads/upload
// @access  Private (Admin only)
exports.uploadLeads = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
        // 1. Fetch Agents
        const agents = await Agent.find().limit(5);
        if (agents.length < 5) {
            return res.status(400).json({ message: `Need at least 5 agents to distribute. Found only ${agents.length}.` });
        }
        const agentIds = agents.map(agent => agent._id);

        // 2. Parse File Data
        let leads = [];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        if (req.file.mimetype === 'text/csv') {
            bufferStream
                .pipe(csv())
                .on('data', (data) => {
                    if (data.FirstName && data.Phone) {
                        leads.push({ firstName: data.FirstName, phone: data.Phone, notes: data.Notes || '' });
                    }
                })
                .on('end', async () => {
                   await distributeAndSave(leads, agentIds, res);
                });
        } else { // Handle Excel files
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            
            jsonData.forEach(item => {
                if(item.FirstName && item.Phone){
                    leads.push({ firstName: item.FirstName, phone: item.Phone, notes: item.Notes || '' });
                }
            });
            await distributeAndSave(leads, agentIds, res);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Helper function for distribution and saving
async function distributeAndSave(leads, agentIds, res) {
    if (leads.length === 0) {
        return res.status(400).json({ message: 'No valid leads found in the file. Ensure columns are named FirstName and Phone.' });
    }

    // 3. Distribution Logic
    const distributedLeads = [];
    const totalLeads = leads.length;
    const numAgents = agentIds.length;

    leads.forEach((lead, index) => {
        const agentIndex = index % numAgents;
        distributedLeads.push({
            ...lead,
            assignedTo: agentIds[agentIndex],
        });
    });

    // 4. Save to Database
    try {
        await Lead.insertMany(distributedLeads);
        res.status(200).json({
            message: `${totalLeads} leads have been successfully uploaded and distributed among ${numAgents} agents.`,
        });
    } catch(dbError) {
        console.error(dbError.message);
        res.status(500).send('Database Error');
    }
}


// --- Fetch Distributed Leads Logic ---

// @desc    Get all leads, grouped by agent
// @route   GET /api/leads
// @access  Private (Admin only)
exports.getDistributedLeads = async (req, res) => {
    try {
        // Fetch all leads and populate the 'assignedTo' field with agent's name and email
        const leads = await Lead.find().populate('assignedTo', 'name email');

        // Group the leads by agent name
        const groupedLeads = leads.reduce((acc, lead) => {
            const agentName = lead.assignedTo ? lead.assignedTo.name : 'Unassigned';
            if (!acc[agentName]) {
                acc[agentName] = [];
            }
            acc[agentName].push(lead);
            return acc;
        }, {});

        res.status(200).json(groupedLeads);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};