const 
    fileUpload      = require('express-fileupload'),
    rateLimit       = require('express-rate-limit'),
    cookieParser    = require('cookie-parser'),
    contentType     = require('content-type'),
    mongoose        = require('mongoose'),
    getRawBody      = require('raw-body'),
    express         = require('express'),
    helmet          = require('helmet'),
    path            = require('path'),
    cors            = require('cors'),
    hpp             = require('hpp'),
    errorHandler    = require('./middleware/errorHandler'),
    credentials     = require('./middleware/credentials'),
    { logger }      = require('./middleware/logEvents'),
    verifyJWT       = require('./middleware/verifyJWT'),
    corsOptions     = require('./config/corsOptions'),
    connectDB       = require('./config/dbConn');
require('dotenv').config();
const PORT = process.env.PORT || 3500;
const app = express();

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Helmet
app.use(helmet());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb'}));

// built-in middleware for json 
app.use(express.json({limit: '10mb'}));

// HPP
app.use(hpp());

//middleware for cookies
app.use(cookieParser());

// file upload
app.use(fileUpload({
    createParentPath: true
}));

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// limitter
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10000,
}))

// routes
app.use('/',            require('./routes/root'));
app.use('/register',    require('./routes/register'));
app.use('/auth',        require('./routes/auth'));
app.use('/refresh',     require('./routes/refresh'));
app.use('/logout',      require('./routes/logout'));
app.use('/mv',          require('./routes/public/modelview'));
app.use('/sendreports', require('./routes/public/publicreports'));

app.use(verifyJWT);
app.use('/files',       require('./routes/api/files'));
app.use('/products',    require('./routes/api/products'));
app.use('/users',       require('./routes/api/users'));
app.use('/models',      require('./routes/api/models'));
app.use('/getreports',  require('./routes/api/reports'));

app.all('*', (req, res) => {
    res.status(404);
    req.accepts('html')
    ?   res.sendFile(path.join(__dirname, 'views', '404.html'))
    :   req.accepts('json')
        ?   res.json({ "error": "404 Not Found" })
        :   res.type('txt').send("404 Not Found");
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});