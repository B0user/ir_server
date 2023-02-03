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
            Support: Number,
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
        title: String,
        origin: String,
        messages: [{
            source: String,
            text:String,
            file_path:String,
            date: Date
        }],
        details: Object,
        isClosed: Boolean
    }),

    contactFormSchema = new Schema({
        name: String,
        email: String,
        phone: String,
        message: String
    })


const
    User = model('User', userSchema),
    Product = model('Product', productSchema),
    Model = model('Model', modelSchema),
    SupportChat = model('SupportChat', supportChatSchema),
    ContactForm = model('ContactForm', contactFormSchema)

module.exports = { User, Product, Model, SupportChat, ContactForm };