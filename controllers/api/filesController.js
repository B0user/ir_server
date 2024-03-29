const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const { getUser_id } = require('./usersController');

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
            const name = uuid() + '.' + model.name.split('.').pop();
            const pathModel = path.join('public', 'media', 'models', client_id, product_id, name);
           
            const result = await uploadService(model, pathModel);
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
            const pathImage = path.join('public', 'media', 'thumbs', client_id.toString(), name);
            
            const result = await uploadService(image, pathImage);
            if (!result) return res.sendStatus(409);
            res.status(201).json(result);
        }

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const uploadImages = async (req, res) => {
    try {
        if(!req.files || !req.user) {
            return res.status(400).send({
                status: false,
                message: 'No file info uploaded'
            });
        } else {
            // Get info
            const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images]; // Wrap single file in an array
            if (images.length === 0) return res.sendStatus(400);
            
            const client_id = await getUser_id(req.user);
            const imagePaths = []; // Array to store the paths
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const name = uuid() + "." + img.name.split(".").pop();
                const pathImage = path.join(
                "public",
                "media",
                "images",
                client_id.toString(),
                name
                );
                const result = await uploadService(img, pathImage);
                imagePaths.push(result.path); // Push the path to the array

            }

            if (!imagePaths.length) return res.sendStatus(409);
            res.status(201).json({ paths: imagePaths });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}

const updateService = async (file, path, prevPath) => {
    try {
        await fs.unlink(prevPath);
        return await uploadService(file, path);
    } catch (err) {
        console.error(err);
        return null;
    }
}

const uploadService = async (file, path) => {
    try {
        const savePath = path.substring(6);
        // Uploading
        file.mv(path);
        return {path: savePath};
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    uploadModel,
    uploadThumb,
    uploadImages,
}