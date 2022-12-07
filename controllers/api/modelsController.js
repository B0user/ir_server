const { Model, Product } = require('../../model/Schemas');
const { checkId } = require('./usersController');

const addModel = async (req,res) => {
    // Check inputs
    let pid = req.params.pid;
    const { size, model_path } = req.body;
    if(!pid || !size || !model_path) return res.status(400).json({ 'message': 'Not enough data' });
    pid = checkId(pid);
    if(!pid) return res.status(400).json({ 'message': 'Wrong ID request' });
    // DB work
    try { 
        const foundProduct = await Product.findById(pid);
        if (!foundProduct) return res.status(204).json({ 'message': `This product does not exist`});
        
        const result = await Model.create({
            product_id: pid,
            size: size,
            model_path: model_path,
            active: true
        });

        const chain = foundProduct.spoma_chain.find((chain) => chain.size === size);
        if(chain) foundProduct.spoma_chain[foundProduct.spoma_chain.indexOf(chain)].model = result._id;
        else foundProduct.spoma_chain.push({size: size, model: result._id});

        let message = await foundProduct.save();

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
    const { size, model_path } = req.body;
    if(!id || !size ) return res.status(400).json({ 'message': 'Not enough data' });
    id = checkId(id);
    if(!id) return res.status(400).json({ 'message': 'Wrong ID request' });

    // DB work
    try {
        // Find Model
        const foundModel = await Model.findById(id).exec();
        if (!foundModel) return res.sendStatus(401);
        // Find and change original Product
        const originProduct = await Product.findById(foundModel.product_id).exec();

        var chain = originProduct.spoma_chain.find((chain) => chain.size === size);
        var index = originProduct.spoma_chain.indexOf(chain);
        if (index !== -1) originProduct.spoma_chain[index].size = size;

        // Save changes of Model
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

        // Find SPOMA chains
        var chain = originProduct.spoma_chain.find((chain) => chain.size === savedModel.size);
        if( !chain ) originProduct.spoma_chain.push({"size": `${savedModel.size}`, "model": savedModel._id, "active": savedModel.active});
        else {
            var index = originProduct.spoma_chain.indexOf(chain);
            if(!chain.model || chain.model !== savedModel._id) originProduct.spoma_chain[index].model = savedModel._id;
            originProduct.spoma_chain[index].active = savedModel.active;

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