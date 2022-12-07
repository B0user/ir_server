const { User, Model, Product } = require('../../model/Schemas');
const { checkId } = require('./usersController');

const getProductsForClient = async (req, res) => {
    // Check inputs
    let id = req.params.cid;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });

    try {
        // Find Client
        const client = await User.findOne({ _id: id, active: true }).exec();
        if(!client) return res.status(404).json({ 'message': `This client does not exist`});

        // Get Products List
        const result = await Product.find({ client_id: id, active: true }).exec();
        if (!result) return res.status(204).json({ 'message': `This client has no Products`});

        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getModelInfoForProduct = async (req, res) => {
    // Check inputs
    let pid = req.params.pid;
    if(!pid ) return res.status(400).json({ 'message': 'No ID provided' });
    pid = checkId(pid);
    if(!pid) return res.status(400).json({ 'message': 'Wrong ID request' });
    // DB work
    try {
        const foundProduct = await Product.findOne({ _id: pid, active: true });
        if (!foundProduct) return res.status(204).json({ 'message': `This product does not exist`});
        // Check if subscription active
        const client = await User.findOne({ _id: foundProduct.client_id, active: true }).exec();
        if(!client) return res.status(404).json({ 'message': `This client does not exist`});
        // Get Models List
        const result = await Model.find({ product_id: pid }).exec();
        if (!result) return res.status(204).json({ 'message': `This product has no Models`});

        res.json({models: result, link: foundProduct.link, name: foundProduct.name});
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = {
    getProductsForClient,
    getModelInfoForProduct
}