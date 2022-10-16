const { Model, Product } = require('../../model/Schemas');
const { isExistingProduct } = require('./productsController');

const addModel = async (req,res) => {
    try {   
        const { pid } = req.params;
        const { color, size, model_path } = req.body;
        if(!pid || !color || !size || !model_path){
            return res.status(400).json({ 'message': 'Not enough data' });
        }
        const productExists = await Product.findById(pid);
        if (!productExists) return res.status(204).json({ 'message': `This product does not exist`});
        
        const result = await Model.create({
            product_id: pid,
            color: color,
            size: size,
            model_path: model_path
        });
        productExists.models.push(result._id);
        productExists.sizes.push(result.size);
        await productExists.save();
        
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const readModel = async (req, res) => {
    const { id } = req.params;
    try {
        // Get Models List
        const result = await Model.findById(id);
        if (!result) {
            return res.status(204).json({ 'message': `There is no such Model`});
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const updateModel = async (req, res) => {
    const { id } = req.params;
    const { color, size, model_path } = req.body;
    if(!id || !color || !size ){
        return res.status(400).json({ 'message': 'Not enough data' });
    }
    try {
        const modelExists = await isExistingModel(id);
        if (!modelExists) return res.status(204).json({ 'message': `This model does not exist`});

        const foundModel = await Model.findById(id).exec();
        if (!foundModel) return res.sendStatus(401);
        try {
            foundModel.color = color;
            foundModel.size = size;
            if (model_path) {
                foundModel.model_path = model_path;
            }
            const result = await foundModel.save();
            // await productExists.sizes.push(result.size);

            return res.status(201).json(result);
        } catch (err) {
            return res.status(500).json(err);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const archieveModel = async (req, res) => {
    const { id } = req.params;
    try {
        const foundModel = await Model.findById(id).exec();
        if( !foundModel ) return res.status(204).json({ 'message': `This model does not exist`});
        foundModel.active = false;

        const result = await foundModel.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const restoreModel = async (req, res) => {
    const { id } = req.params;
    try {
        const foundModel = await Model.findById(id).exec();
        if( !foundModel ) return res.status(204).json({ 'message': `This model does not exist`});
        foundModel.active = true;

        const result = await foundModel.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getAllModels = async (req, res) => {
    try {
        // Get Models List
        const result = await Model.find();
        if (!result) {
            return res.status(204).json({ 'message': `There are no Models`});
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const getVariations = async (req, res) => {
    const { pid } = req.params;
    try {
        const productExists = await isExistingProduct(pid);
        if (!productExists) return res.status(204).json({ 'message': `This product does not exist`});
        // Get Models List
        const result = await Model.find({ product_id: pid }).exec();
        if (!result) {
            return res.status(204).json({ 'message': `This product has no Models`});
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


const isExistingModel = async (id) => {
    try {
        const foundModel = await Model.findById(id);
        if(!foundModel) return false;
        return true;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = {
    addModel,
    getAllModels,
    getVariations,
    readModel,
    updateModel,
    archieveModel,
    restoreModel,
    isExistingModel
}