const {model, Schema, ObjectId} = require('mongoose');

const 
    diskSchema = new Schema({
        accessLink: String,
        storage: {
            type: Number,
            required: true
        },
        filled:{
            type: Number,
            def: 0
        }
    }),
    fileSchema = new Schema({
        name:{
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        size: { type: Number },
        path: { type: String, def:'' },
        disk: { type: ObjectId, ref: 'Disk' }
    }),
    userSchema = new Schema({
        username: {
            type: String,
            required: true
        },
        roles: {
            User: {
                type: Number,
                default: 8888
            },
            Moder: Number,
            Client: Number,
            Boss: Number
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: String,
        products: [{
            type: ObjectId,
            ref: 'Product'
        }]
    }),
    productSchema = new Schema({
        client_id: {
            type: ObjectId,
            ref:'User'
        },
        category: {
            type: String,
            requierd: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        sizes: [ String ],
        models: [{
            type: ObjectId,
            ref: 'Model'
        }],
        thumb: {
            type: ObjectId,
            ref: 'File'
        },
        thumb_link: {
            type: String,
            default: ''
        },
        images: [{
            type: ObjectId,
            ref: 'File'
        }],
        link: {
            type: String,
            default: ''
        }
    }),
    modelSchema = new Schema({
        product_id: {
            type: ObjectId,
            ref:'Product'
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        file: {
            type: ObjectId,
            ref: 'File'
        },
        link: {
            type: String,
            default: ''
        }
    });

const
    Disk = model('Disk', diskSchema),
    File = model('File', fileSchema),
    User = model('User', userSchema),
    Product = model('Product', productSchema),
    Model = model('Model', modelSchema);

module.exports = { Disk, File, User, Product, Model };