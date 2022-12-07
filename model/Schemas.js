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
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        link: {
            type: String,
            default: ''
        },
        thumb_path: {
            type: String,
            default: ''
        },
        spoma_chain: [{
            size: String,
            price: String,
            old_price: String,
            model: {
                type: ObjectId,
                ref: 'Model'
            },
            active: Boolean
        }],
        active: {
            type: Boolean,
            default: true
        }
    }),
    modelSchema = new Schema({
        product_id: ObjectId,
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
        }
    }),

    supportChatSchema = new Schema({
        message: String,
        screenshot_path: String,
        details: {
            type: String,
            osVersion: String,
            browser: String
        },
        report_date: Date,
        isComplete: Boolean
    })


const
    User = model('User', userSchema),
    Product = model('Product', productSchema),
    Model = model('Model', modelSchema),
    SupportChat = model('SupportChat', supportChatSchema)
module.exports = { User, Product, Model, SupportChat };