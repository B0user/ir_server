const { Model, Product } = require('../../model/Schemas');
const { checkId } = require('./usersController');

const addModel = async (req,res) => {
    // Check inputs
    let pid = req.params.pid;
    const { color, size, model_path } = req.body;
    if(!pid || !color || !size || !model_path) return res.status(400).json({ 'message': 'Not enough data' });
    pid = checkId(pid);
    if(!pid) return res.status(400).json({ 'message': 'Wrong ID request' });
    // DB work
    try { 
        const foundProduct = await Product.findById(pid);
        if (!foundProduct) return res.status(204).json({ 'message': `This product does not exist`});
        
        const result = await Model.create({
            product_id: pid,
            color: color,
            size: size,
            model_path: model_path
        });

        if(!foundProduct.models.includes(result._id)) foundProduct.models.push(result._id);
        if(!foundProduct.sizes.includes(result.size)) foundProduct.sizes.push(result.size);

        await foundProduct.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const readModel = async (req, res) => {
    // Check inputs
    let id = req.params.id;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });

    // DB work
    try {
        // Get Models List
        const result = await Model.findById(id);
        if (!result) return res.status(204).json({ 'message': `There is no such Model`});

        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const updateModel = async (req, res) => {
    // Check inputs
    let id = req.params.id;
    const { color, size, model_path } = req.body;
    if(!id || !color || !size ) return res.status(400).json({ 'message': 'Not enough data' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });

    // DB work
    try {
        // Find Model
        const foundModel = await Model.findById(id).exec();
        if (!foundModel) return res.sendStatus(401);
        // Find and change original Product
        const originProduct = await Product.findById(foundModel.product_id).exec();
        var index = originProduct.sizes.indexOf(foundModel.size);
        if (index !== -1) originProduct.sizes[index] = size;
        // Save changes of Model
        foundModel.color = color;
        foundModel.size = size;
        if (model_path) foundModel.model_path = model_path;

        const result = await foundModel.save();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const archieveModel = async (req, res) => {    
    // Check inputs
    let id = req.params.id;
    if(!id) return res.status(400).json({ 'message': 'No ID provided' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });

    // DB work
    try {
        const foundModel = await Model.findById(id).exec();
        if( !foundModel ) return res.status(204).json({ 'message': `This model does not exist`});
        foundModel.active = !foundModel.active;
        const savedModel = await foundModel.save();
        // Change original Product
        const originProduct = await Product.findById(savedModel.product_id).exec();
        if( !originProduct ) return res.status(204).json({ 'message': `This product does not exist`});
        if( savedModel.active ) {
            if(!originProduct.sizes.includes(savedModel.size)) originProduct.sizes.push(savedModel.size);
        }
        else if(originProduct.sizes.includes(savedModel.size)) {
            var index = originProduct.sizes.indexOf(savedModel.size);
            if (index !== -1) originProduct.sizes.splice(index, 1);
        } 
        await originProduct.save();
        res.json(savedModel);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getAllModels = async (req, res) => {
    try {
        // Get Models List
        const result = await Model.find();
        if (!result) return res.status(204).json({ 'message': `There are no Models`});

        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const isExistingModel = async (id) => {
    try {
        const foundModel = await Model.findById(id);
        return !!foundModel;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    addModel,
    getAllModels,
    readModel,
    updateModel,
    archieveModel,
    isExistingModel
}