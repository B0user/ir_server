const path = require('path');

const uploadFiles = async (req, res) => {
    const {client_id, product_id} = req.body;
    try {
        if(!req.files || !client_id || !product_id) {
            res.send({
                status: false,
                message: 'No file info uploaded'
            });
        } else {
            const image = req.files.image;
            const model = req.files.model;
            
            const image_path = path.join('.', 'public', 'media', 'images', client_id, product_id, image.name);
            const model_path = path.join('.', 'public', 'media', 'models', client_id, product_id, model.name);
            
            // Production
            if (process.env.NODE_ENV === 'production') {
                image_path = path.join('.', 'public', 'media', 'images', client_id, product_id, image.name);
                model_path = path.join('.', 'public', 'media', 'models', client_id, product_id, model.name);
            }

            //Use the mv() method to place the file in directory
            image?.mv(image_path);
            model?.mv(model_path);
            //send response
            res.sendStatus(201);
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    uploadFiles
}