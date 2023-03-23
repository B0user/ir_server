require('dotenv').config();
const allowedOrigins = [
    'https://inroom.tech',
    'https://admin.inroom.tech',
    'https://panel.inroom.tech',
    'https://api.inroom.tech',
    'http://localhost:3000',
    'http://localhost:2000',
    'http://127.0.0.1:3000',
    'http://37.99.123.117:3000',
    'http://2.132.101.123:3000',
    'http://5.34.113.45:3000',
    'http://192.168.0.111:3000'
];

module.exports = allowedOrigins;