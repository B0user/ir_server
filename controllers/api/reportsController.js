const { SupportChat, User } = require('../../model/Schemas');
const { checkId } = require('./usersController');


const createPublicReport = async (req, res) => {
    // Check inputs
    const { title, messages, details } = req.body;
    if ( !title  || !messages  || !details) return res.status(400).json({ 'message': 'Not enough data' });
    try {
        // New report data
        const newReport = {
            title: title,
            origin: 'anonymous',
            messages: messages,
            details: details,
            isClosed: false
        }
        // DB Work
        await SupportChat.create(newReport);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const createClientReport = async (req, res) => {
    // Check inputs
    const { title, messages, details } = req.body;
    if ( !title  || !messages  || !details || !req?.user ) return res.status(400).json({ 'message': 'Not enough data' });
    try {
        const foundUser = await User.findOne({username: req.user});
        if(!foundUser) return res.status(404).json({ 'message': `This client does not exist`});

        // New report data
        const newReport = {
            title: title,
            origin:  foundUser._id.toString(), 
            messages: messages,
            details: details,
            isClosed: false
        }
        // DB Work
        await SupportChat.create(newReport);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getReports = async (req, res) => {
    try {
        const reports = await SupportChat.find();
        if (!reports) return res.status(204).json({ 'message': `There are no reports`});
        res.json(reports);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getReportsForClient = async (req, res) => {
    if (!req?.user) return res.status(400).json({ 'message': 'Not enough data' });
    try {
        const foundUser = await User.findOne({username: req.user});
        if(!foundUser) return res.status(404).json({ 'message': `This client does not exist`});

        var origin = foundUser._id.toString()
        const reports = await SupportChat.find({origin: origin});
        if (!reports) return res.status(204).json({ 'message': `There are no such reports`});

        res.json(reports);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getReportByID = async (req, res) => {
    let id = req.params.id;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });

    try {
        const report = await SupportChat.findById(id);
        if (!report) return res.status(204).json({ 'message': `There is no such report`});
        res.json(report);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const updateReport = async (req, res) => {
    let id = req.params.id;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });
    // Check inputs
    const { title, messages, isClosed } = req.body;
    if ( !title  || !messages || !req?.user ) return res.status(400).json({ 'message': 'Not enough data' });
    try {
        const foundReport = await SupportChat.findById(id);
        if (!foundReport) return res.status(204).json({ 'message': `There is no such report`});
        foundReport.messages = messages;
        foundReport.isClosed = isClosed;

        await foundReport.save();
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const deleteReport = async (req, res) => {
    let id = req.params.id;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });
    try {
        const report = await SupportChat.findByIdAndDelete(id);
        if (!report) return res.status(204).json({ 'message': `There is no such report`});
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    
    }
}

module.exports = {
    getReports,
    createPublicReport,
    createClientReport,
    getReportByID,
    getReportsForClient,
    updateReport,
    deleteReport,
}