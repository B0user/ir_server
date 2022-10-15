const {Product, User} = require('../../model/Schemas');
const {getUser_id} = require('./usersController');

const addProduct = async (req,res) => {
    const { category, name, description, price, thumb_id, thumb_path } = req.body;
    if(!category || !name || !description || !price || !thumb_id || !thumb_path || !req?.user){
        return res.status(400).json({ 'message': 'Not enough data' });
    }
    try {
        const foundUser = await User.findOne({username: req.user});
        if(!foundUser) {
            return res.status(204).json({ 'message': `This client does not exist`});
        }
        const result = await Product.create({
            category: category,
            name: name,
            description: description,
            price: price,
            client_id: foundUser._id,
            thumb: thumb_id,
            thumb_link: thumb_path
        });
        await foundUser.products.push(result._id);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
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
    const { name, description, price, thumb_id, thumb_path  } = req.body;
    if(!id || !name || !description || !price || !req?.user){
        return res.status(400).json({ 'message': 'Not enough data' });
    }
    try {
        const _id = await getUser_id(req.user);
        if(!_id) {
            return res.status(204).json({ 'message': `This client does not exist`});
        }
        const found = await Product.findById(id);
        found.name = name;
        found.description = description;
        found.price = price;
        found.client_id = _id;
        if (thumb_id && thumb_path) {            
            found.thumb = thumb_id;
            found.thumb_link = thumb_path;
        }
        const result = await found.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const archieveProduct = async (req, res) => {
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
    product.active = false;
    const result = await product.save();
    res.json(result);
}

const restoreProduct = async (req, res) => {
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
    product.active = true;
    const result = await product.save();
    res.json(result);
}

const getAllClientProducts = async (req, res) => {
    try {
        if(!req?.user){
            return res.status(400).json({ 'message': 'Wrong request' });
        }
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

const getPublicClientProducts = async (req, res) => {
    try {
        const {cid} = req.params;
        if(!cid){
            return res.status(400).json({ 'message': 'Wrong request' });
        }
        const client = await User.findById(cid);
        if(!client) {
            return res.status(204).json({ 'message': `This client does not exist`});
        }
        // Get Products List
        const result = await Product.find({ client_id: cid, active: true }).exec();
        if (!result) {
            return res.status(204).json({ 'message': `This client has no Products`});
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getAllProducts = async (req, res) => {
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
    addProduct,
    readProduct,
    updateProduct,
    archieveProduct,
    restoreProduct,
    isExistingProduct,
    getPublicClientProducts,
    getAllClientProducts,
    getAllProducts
}