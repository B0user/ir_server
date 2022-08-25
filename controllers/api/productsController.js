const {Product} = require('../../model/Schemas');
const {getUser_id} = require('./usersController');

const createProduct = async (req,res) => {
    const { category, name, description, price } = req.body;
    if(!category || !name || !description || !price || !req?.user){
        return res.status(400).json({ 'message': 'Not enough data' });
    }
    try {
        const id = await getUser_id(req.user);
        if(!id) {
            return res.status(204).json({ 'message': `This client does not exist`});
        }
        const result = await Product.create({
            category: category,
            name: name,
            description: description,
            price: price,
            client_id: id
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const readAllProductsForClient = async (req, res) => {
    if(!req?.user){
        return res.status(400).json({ 'message': 'Wrong request' });
    }
    try {
        const _id = await getUser_id(req.user);
        if(!_id) {
            return res.status(204).json({ 'message': `This client does not exist`});
        }
        // Get Products List
        const result = await Product.find({ client_id: _id }).exec();
        if (!result) {
            return res.status(204).json({ 'message': `This client has no Products`});
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const readAllProducts = async (req, res) => {
    try {
        // Get Products List
        const result = await Product.find();
        if (!result) {
            return res.status(204).json({ 'message': `There are no Products`});
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


const readProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ "message": 'Product ID required' });
    const result = await Product.find({ _id: id }).exec();
    if (!result) {
        return res.status(204).json({ 'message': `Product with ID ${ id} not found` });
    }
    res.json(result);
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    if(!id || !name || !description || !price || !req?.user){
        return res.status(400).json({ 'message': 'Not enough data' });
    }
    try {
        const _id = await getUser_id(req.user);
        if(!_id) {
            return res.status(204).json({ 'message': `This client does not exist`});
        }
        const result = await Product.updateOne(
            {
                _id: id
            },
            {
                name: name,
                description: description,
                price: price,
                client_id: _id
            }
        );

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id || !req?.user) return res.status(400).json({ "message": 'Wrong request' });
    const _id = await getUser_id(req.user);
    if(!_id) {
        return res.status(204).json({ 'message': `This client does not exist`});
    }
    const product = await Product.findOne({ _id: id,  client_id: _id}).exec();
    if (!product) {
        return res.status(204).json({ 'message': `Product ID ${req.params.id} not found` });
    }
    const result = await product.deleteOne({ _id: id });
    res.json(result);
}

const isExistingProduct = async (id) => {
    try {
        const foundProduct = await Product.findById(id);
        if(!foundProduct) return false;
        return true;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    createProduct,
    readProduct,
    updateProduct,
    deleteProduct,
    isExistingProduct,
    readAllProductsForClient,
    readAllProducts
}