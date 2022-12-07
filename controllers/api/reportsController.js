const { SupportChat } = require('../../model/Schemas');


const createReport = async (req, res) => {
    // Check inputs
    const { message, screenshot_path, details, report_date} = req.body;
    if ( !message || !screenshot_path || !details || !report_date) return res.status(400).json({ 'message': 'Not enough data' });
    try {
        // New report data
        const newReport = {
            message: message,
            screenshot_path: screenshot_path,
            details: details,
            report_date: report_date,
            isComplete: false
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

module.exports = {
    getReports,
    createReport
}