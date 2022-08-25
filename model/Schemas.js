const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    refreshToken: String
});
const User = mongoose.model('User', userSchema);

const productSchema = new Schema({
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
    client_id: {
        type: Schema.Types.ObjectId,
        ref:'users'
    }
});
const Product = mongoose.model('Product', productSchema);

const modelSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref:'products'
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    }
});
const Model = mongoose.model('Model', modelSchema);

module.exports = {User, Product, Model};