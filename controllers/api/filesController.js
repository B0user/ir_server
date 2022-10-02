const path = require('path');
const { v4: uuid } = require('uuid');
const { File, Model } = require('../../model/Schemas');
const {getUser_id} = require('./usersController');

const uploadModel = async (req, res) => {
    try {
        const {client_id, product_id} = req.body;
        if(!req.files || !client_id || !product_id) {
            console.log('no file uploaded');
            return res.status(400).send({
                status: false,
                message: 'No file info uploaded'
            });
        } else {
            // Get info
            const model = req.files.model;
            if(!model) return res.sendStatus(400);
            const name = uuid() + '.' + model.name.split('.').pop();;
            const pathModel = path.join('\\', 'media', 'models', client_id, product_id, name);
           
            const result = await uploadService(model, 'model', pathModel, name);
            console.log(result);
            if (!result) return res.sendStatus(409);
            res.status(201).json(result);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const uploadThumb = async (req, res) => {
    try {
        if(!req.files || !req.user) {
            return res.status(400).send({
                status: false,
                message: 'No file info uploaded'
            });
        } else {
            // Get info
            const image = req.files.thumb;
            if(!image) return res.sendStatus(400);
            const client_id = await getUser_id(req.user);
            
            const name = uuid() + '.' + image.name.split('.').pop();
            const pathImage = path.join('\\', 'media', 'thumbs', client_id.toString(), name);
            
            const result = await uploadService(image, 'image', pathImage, name);
            if (!result) return res.sendStatus(409);
            res.status(201).json(result);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const deleteModelById = async (req, res) => {
    try {
        console.log('MODEL BY ID DELETE');
        const { id } = req.params;
        const file_id = await Model.findById(id, 'file');
        console.log(file_id);
        if (!file_id) return res.sendStatus(400);
        const result = await deleteService(file_id);
        console.log(result);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const deleteFile = async (req, res) => {
    try {
        const {file_id} = req.params;
        if (!file_id) return res.sendStatus(400);
        const res = await deleteService(file_id);
        if (!res) return res.sendStatus(400);
        else res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const deleteService = async (file_id) => {
    try {
        console.log('DELETION');
        const found = await File.findById(file_id);
        console.log(found);
        if (!found) return null;
        const res = await found.delete();
        console.log(res);
        // Delete or archieve the file?

        return true;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const uploadService = async (file, fileType, path, name) => {
    try {
        const found = await File.findOne({name: name, path: path});
        if (found) return {path: found.path, file_id: found._id};
        // Uploading
        file.mv("public" + path);
        // Create new File
        const fileDB = new File({
            name: name,
            type: fileType,
            size: file.size,
            path: path
        });
        await fileDB.save();
        return {path: path, file_id: fileDB._id};
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    uploadModel,
    uploadThumb,
    deleteModelById,
    deleteFile
}