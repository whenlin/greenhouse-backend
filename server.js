var express = require('express');
var app = express();    
var bodyParser = require('body-parser');
const cors = require('cors');
var bcrypt = require('bcrypt');
const saltRounds = 10;

//Going to need to install johnny-five package when ready in order to connect and communicate with arduino board!!!!!!!!!!!

var User = require('./app/models/User');
var Plant = require('./app/models/Plant');

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
                data.password = hash.toString();
            
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
    
    .get('/allUsers', function(req, response, next){
        
        User.find(function(err, User) {
            if(err){
                console.log(err);
                throw err;
            }else{
                console.log(User);
                response.json({users: User});
            }
        });
        
    })
    
    .post('/signIn', function(req, response, next){
        // Load hash from your password DB.
        
        var uname = req.body.username;
        var passwordEntered = req.body.password;
        
        User.find({username: uname}, function(err, user){
            
            var hash = user.password;
            hash.toString();
            console.log(hash);
            console.log(passwordEntered);
            
            if(err){
                console.log(err);
            } else {
                console.log("Comparing entered password and saved password right now.......");
                
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
        
        var plantName = req.body.plantName;
        var plantType = req.body.plantType;
        
        var newPlant = new Plant();                  //the light setting that the user set from their mobile app
            
            newPlant.plantName = plantName;
            newPlant.plantType = plantType;
            newPlant.minTemperature = "N/A";
            newPlant.currentTemperature = "N/A";
            newPlant.maxTemperature = "N/A";
            newPlant.minMoisture = "N/A";
            newPlant.currentMoisture = "N/A";
            newPlant.maxMoisture = "N/A";
            newPlant.minLight = "N/A";
            newPlant.currentLight = "N/A";
            newPlant.maxLight = "N/A";
            
                        
            newPlant.save(function(err){
                if(err) {
                      console.log(err);
                      throw err;
                  }
                  else{
                      console.log("New plant with name " + newPlant.plantName + " and ID number " + newPlant._id + " was added!");
                      res.json({Plant: newPlant});
                  }
            });
    })
    
    .post('/setLight/:_id', function(req, res, next){
        
    })
    
    .post('/setMoisture/:_id', function(req, res, next){
        
    })
    
    .post('/setTemperature/:_id', function(req, res, next){
        
    })
    
    .post('/updatePlantInfo/:_id', function(req, res, next){
        
    })
    
    .get('/sunlightInfo/:_id', function(req, res, next){
        
    })
    
    .get('/moistureInfo/:_id', function(req, res, next){
        
    })
    
    .get('/temperatureInfo/:_id', function(req, res, next){
        
    })
    
    .get('/retrievePlantInfo/:_id', function(req, res, next){
        
    })
    
    .get('/listPlants', function(req, res, next){       //this function will list the plant names
        
        console.log("The list of plants is being requested...");
    
        Plant.find(function(err, Plants){
            if(err){
               console.log(err);
               throw err;
            } else {
                
            var array = [];
               
            for(i in Plants){
                 array.push(Plants[i].plantName); //THE ORDER OF THE ELEMENTS IN THIS ARRAY: PLANTNAME FIRST FOLLOWED BY ITS CORRESPONDING ID
                 array.push(Plants[i]._id);                      //THE ID NUMBERS ARE IN THE ODD ELEMENTS, THE PLANT NAMES ARE IN THE EVEN ELEMENTS
            }
               
               
            res.json({plants: array});
                
            }
        });
    });
    
    
    app.listen(port, function() 
{
    console.log('The server is listening on port ' + port);
});
    