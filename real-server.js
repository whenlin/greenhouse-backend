var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors=require('cors');
//var bcrypt = require('bcrypt');

var User = require('./app/models/User');
var port = 8080;

// DATABASE SETUP
    var mongoose   = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/greenhouseData'); // connect to our database
    
    // Handle the connection event
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    
    db.once('open', function() {
      console.log("DB connection alive");
    });

    app.use(function(request, response, next)
    {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
        next();
    });
    
    
    // the following 2 middleware convert the URL req and res to json format
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(cors());
    
    app.post('/createUser', function(req, res, next){
        
        var uname = req.body.username;
        var pass = req.body.password;
        
        var data = new User();
        data.username = uname;
        data.password = data.generateHash(pass);
        
        data.save(function(err){
            if(err){
                console.log(err);
                res.send('error occurred');
            } else {
                res.json({message: 'User successfully entered!'});
                console.log('success!');
            }
        });
        
    })
    
    .get('/', function(req, res, next){
        
    });
    
    