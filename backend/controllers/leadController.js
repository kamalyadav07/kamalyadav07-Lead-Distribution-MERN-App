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


// --- Main Controller Logic ---

// @desc    Upload a CSV/Excel and distribute leads
// @route   POST /api/leads/upload
// @access  Private (Admin only)
exports.uploadLeads = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
        // --- 1. Fetch Agents ---
        // As per requirements, we distribute among 5 agents.
        const agents = await Agent.find().limit(5);
        if (agents.length < 5) {
            return res.status(400).json({ message: `Need at least 5 agents to distribute. Found only ${agents.length}.` });
        }
        const agentIds = agents.map(agent => agent._id);

        // --- 2. Parse File Data ---
        let leads = [];
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        if (req.file.mimetype === 'text/csv') {
            bufferStream
                .pipe(csv())
                .on('data', (data) => {
                    // Assuming headers are FirstName, Phone, Notes
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

// --- Helper function for distribution and saving ---
async function distributeAndSave(leads, agentIds, res) {
    if (leads.length === 0) {
        return res.status(400).json({ message: 'No valid leads found in the file. Ensure columns are named FirstName and Phone.' });
    }

    // --- 3. Distribution Logic ---
    const distributedLeads = [];
    const totalLeads = leads.length;
    const numAgents = agentIds.length;

    leads.forEach((lead, index) => {
        const agentIndex = index % numAgents; // This handles sequential distribution perfectly
        distributedLeads.push({
            ...lead,
            assignedTo: agentIds[agentIndex],
        });
    });

    // --- 4. Save to Database ---
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