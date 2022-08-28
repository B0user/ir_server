require('dotenv').config();
const allowedOrigins = [
    `http://localhost:${process.env.PORT}`,
    'http://localhost:3000',
    'http://inroom.tech',
    'http://inroom.tech:2000',
    'http://inroom.tech:3000'    
];

module.exports = allowedOrigins;