const { Product, User } = require('../../model/Schemas');
const { getUser_id, checkId } = require('./usersController');

const addProduct = async (req,res) => {
    // Check inputs
    const { category, name, description, spoma_chain, thumb_path } = req.body;
    if(!category || !name || !description || !spoma_chain || !thumb_path || !req?.user) return res.status(400).json({ 'message': 'Not enough data' });
    // DB work
    try {
        const foundUser = await User.findOne({username: req.user});
        if(!foundUser) return res.status(404).json({ 'message': `This client does not exist`});

        const newProduct = {
            client_id: foundUser._id,
            category: category,
            name: name,
            description: description,
            thumb_path: thumb_path,
            spoma_chain: spoma_chain,
            active: true
        };
        const result = await Product.create(newProduct);

        await foundUser.products.push(result._id);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const readProduct = async (req, res) => {
    // Check inputs
    let id = req.params.id;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });
    // DB work
    try {
        const result = await Product.find({ _id: id }).exec();
        if (!result) return res.status(204).json({ 'message': `Product with ID ${ id} not found` });
        res.json(result);
    } catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const updateProduct = async (req, res) => {
    // Check inputs
    let id = req.params.id;
    const { name, description, spoma_chain, thumb_path  } = req.body;
    if(!id || !name || !description || !spoma_chain || !req?.user) return res.status(400).json({ 'message': 'Not enough data' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });
    // DB work
    try {
        const _id = await getUser_id(req.user);
        if(!_id) return res.status(404).json({ 'message': `This client does not exist`});

        const found = await Product.findById(id);
        found.client_id = _id;
        found.name = name;
        found.description = description;
        found.spoma_chain = spoma_chain;
        if (thumb_path) found.thumb_path = thumb_path;

        const result = await found.save();

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const archieveProduct = async (req, res) => {
    // Check inputs
    let id = req.params.id;
    if (!id || !req?.user ) return res.status(400).json({ "message": 'Wrong request' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });
    // DB work
    try {
        const _id = await getUser_id(req.user);
        if(!_id) return res.status(404).json({ 'message': `This client does not exist`});

        const product = await Product.findOne({ _id: id,  client_id: _id}).exec();
        if (!product) return res.status(204).json({ 'message': `Product ID ${req.params.id} not found` });

        product.active = !product.active;
        const result = await product.save();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    
}

const getAllClientProducts = async (req, res) => {
    // Check inputs
    if(!req?.user) return res.status(400).json({ 'message': 'Wrong request' });
    try {
        const _id = await getUser_id(req.user);
        if(!_id) return res.status(404).json({ 'message': `This client does not exist`});

        // Get Products List
        const result = await Product.find({ client_id: _id }).exec();
        if (!result) return res.status(204).json({ 'message': `This client has no Products`});

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
        if (!result) return res.status(204).json({ 'message': `There are no Products`});

        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const isExistingProduct = async (id) => {
    try {
        const foundProduct = await Product.findById(id);
        return !!foundProduct;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    addProduct,
    readProduct,
    updateProduct,
    archieveProduct,
    isExistingProduct,
    getAllClientProducts,
    getAllProducts
}