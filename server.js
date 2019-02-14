var express = require('express');
var app = express();    
var bodyParser = require('body-parser');
const cors = require('cors');
var bcrypt = require('bcrypt');
const saltRounds = 10;

//Going to need to install johnny-five package when ready in order to connect and communicate with arduino board!!!!!!!!!!!

var User = require('./app/models/User');
var port = 8080;

// DATABASE SETUP
    var mongoose   = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/greenhouseData'); // connect to our database
    
    // Handle the connection event
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    
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
    app.use(bodyParser.json({ limit: '20mb' }));
    app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
    app.use(cors());
    
    app.post('/createUser', function(req, response, next){
        
        var uname = req.body.username;
        var pass = req.body.password;
        
        
         bcrypt.hash(pass, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        
            if(err){
                console.log(err);
            } else {
                var data = new User();
                data.username = uname;
                data.password = hash;
            
                var result;
                var array = [];
            
                    data.save(function(err){
                        if(err){
                            console.log(err);
                           result = "Failed";
                        } else {
                            result = "Success";
                            console.log('sign up success!');
                        }
                        response.json({message: result});
                        
                    });
                    
                  //  array.push(result);

            }//closing brace for if statement
        
        });
        
    })
    
    .post('/signIn', function(req, response, next){
        // Load hash from your password DB.
        
        var uname = req.body.username;
        var passwordEntered = req.body.password;
        
        User.find({username: uname}, function(err, user){
            
            var hash = user.password;
            
            if(err){
                console.log(err);
            } else {
                   bcrypt.compare(passwordEntered, hash, function(err, res) {
                        
                        var result = " ";
                        
                        
                        if(err){
                            console.log(err);
                        }
                        else if(res == true){
                            console.log("success!!");
                            result = "Success";
                        }else{
                            console.log("sign in failed!");
                            result = "Failed";
                        }
                       
                        
                        response.json({message: result});
                });
            }
        });
        
    })
    
    .post('/addPlant', function(req, res, next){
        
    })
    
    .post('/setLight/:plantID', function(req, res, next){
        
    })
    
    .post('/setMoisture/:plantID', function(req, res, next){
        
    })
    
    .post('/setTemperature/:plantID', function(req, res, next){
        
    })
    
    .post('/updatePlantInfo/:plantID', function(req, res, next){
        
    })
    
    .get('/sunlightInfo/:plantID', function(req, res, next){
        
    })
    
    .get('/moistureInfo/:plantID', function(req, res, next){
        
    })
    
    .get('/temperatureInfo/:plantID', function(req, res, next){
        
    })
    
    .get('/retrievePlantInfo/:plantID', function(req, res, next){
        
    })
    
    .get('/listPlants', function(req, res, next){
        
    });
    
    
    app.listen(port, function() 
{
    console.log('The server is listening on port ' + port);
});
    