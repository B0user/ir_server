const {model, Schema, ObjectId} = require('mongoose');

const
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
        }],
        active: {
            type: Boolean,
            default: true
        }
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
        thumb_path: {
            type: String,
            default: ''
        },
        active: {
            type: Boolean,
            default: true
        },
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
        model_path: {
            type: String,
            default: ''
        },
        active: {
            type: Boolean,
            default: true
        },
    });

const
    User = model('User', userSchema),
    Product = model('Product', productSchema),
    Model = model('Model', modelSchema);

module.exports = { User, Product, Model };