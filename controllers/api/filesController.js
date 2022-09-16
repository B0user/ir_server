const path = require('path');
const { File } = require('../../model/Schemas');
const {getUser_id} = require('./usersController');

const uploadModel = async (req, res) => {
    try {
        const {client_id, product_id} = req.body;
        if(!req.files || !client_id || !product_id) {
            return res.status(400).send({
                status: false,
                message: 'No file info uploaded'
            });
        } else {
            // Get info
            const model = req.files.model;
            if(!model) return res.sendStatus(400);
            const pathModel = path.join('\\', 'media', 'models', client_id, product_id, model.name);
           
            const result = await uploadService(model, 'model', pathModel);
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
            const pathImage = path.join('\\', 'media', 'thumbs', client_id.toString(), image.name);
            
            const result = await uploadService(image, 'image', pathImage);
            if (!result) return res.sendStatus(409);
            res.status(201).json(result);
        }

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
        const found = await File.findById(file_id);
        if (!found) return null;
        await found.delete();

        // Delete or archieve the file?

        return true;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const uploadService = async (file, fileType, path) => {
    try {
        const found = await File.findOne({name: file.name, path: path});
        if (found) return {path: found.path, file_id: found._id};
        // Uploading
        file.mv("public" + path);
        // Create new File
        const fileDB = new File({
            name: file.name,
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
    deleteFile
}