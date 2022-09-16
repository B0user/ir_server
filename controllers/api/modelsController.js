const { Model, Product } = require('../../model/Schemas');
const { isExistingProduct } = require('./productsController');

const createModel = async (req,res) => {
    try {   
        const { pid } = req.params;
        const { color, size, file_id, link } = req.body;
        if(!pid || !color || !size || !file_id || !link){
            return res.status(400).json({ 'message': 'Not enough data' });
        }
        const productExists = await Product.findById(pid);
        if (!productExists) return res.status(204).json({ 'message': `This product does not exist`});
        
        const result = await Model.create({
            product_id: pid,
            color: color,
            size: size,
            file: file_id,
            link: link
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

const readVariations = async (req, res) => {
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
    const { color, size, file_id, link } = req.body;
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
            if ( file_id ) foundModel.file = file_id;
            if ( link ) foundModel.link = link;
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

const deleteModel = async (req, res) => {
    const { id } = req.params;
    try {
        const foundModel = await Model.findById(id).exec();
        if( !foundModel ) return res.status(204).json({ 'message': `This model does not exist`});

        const result = await foundModel.delete();
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
    createModel,
    getAllModels,
    readVariations,
    readModel,
    updateModel,
    deleteModel,
    isExistingModel
}