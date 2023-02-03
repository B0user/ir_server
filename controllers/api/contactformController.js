const { ContactForm } = require('../../model/Schemas');

const createContactForm = async (req, res) => {
    // Check inputs
    const { name, email, phone, message } = req.body;
    if ( !name  || !email  || !phone) return res.status(400).json({ 'message': 'Not enough data' });
    try {
        // New report data
        const newFormData = {
            name: name,
            email: email,
            phone: phone,
            message: message
        }
        // DB Work
        var result = await ContactForm.create(newFormData);
        console.log(result);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = { createContactForm }