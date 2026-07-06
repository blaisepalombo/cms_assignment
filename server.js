// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Get defined routing files
var index = require('./server/routes/app');
const messageRoutes = require('./server/routes/messages');
const contactRoutes = require('./server/routes/contacts');
const documentRoutes = require('./server/routes/documents');

var app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cms')
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((err) => {
    console.log('Connection failed: ' + err);
  });

// Tell express to use the following parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev'));

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Tell express to use the Angular build output folder
app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

// Tell express to map routes
app.use('/', index);
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentRoutes);

// Send all other requests back to Angular
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

// Define the port address
const port = process.env.PORT || '3000';
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Start listening
server.listen(port, function() {
  console.log('API running on localhost: ' + port);
});