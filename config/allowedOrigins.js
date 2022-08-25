require('dotenv').config();
const allowedOrigins = [
    `http://localhost:${process.env.PORT}`,
    'http://localhost:3000'
];

module.exports = allowedOrigins;