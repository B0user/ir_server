require('dotenv').config();
const allowedOrigins = [
    'https://inroom.tech',
    'https://admin.inroom.tech',
    'https://panel.inroom.tech',
    'https://api.inroom.tech',
    'http://localhost:3000',
    'http://localhost:2000',
];

module.exports = allowedOrigins;