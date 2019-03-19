const five = require('johnny-five');
const board = new five.Board({repl: false});     //defining the arduino board

board.on("ready", function() {
    
var express = require('express');
var app = express();    
var bodyParser = require('body-parser');
const cors = require('cors');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var User = require('./app/models/User');
var Plant = require('./app/models/Plant');
var plant = require('./app/models/Plant');
var port = 3000;

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


  // Create a standard `led` component instance
 // var led = new five.Led(13);
  board.pinMode(11, five.Pin.PWM);
  var photoResistor = new five.Sensor("A0");
  
  photoResistor.on('change', function() {
      var lightReading = this.scaleTo(0,255);
      //console.log(lightReading);
  })


    
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
        
        //console.log("Body of http request (uname): " + req.body.username);
        
        var passwordEntered = req.body.password;
        
        User.find({ username: req.body.username }, function(err, user){
            
            var hash = user.password;
            //hash.toString();
            console.log(hash);
            console.log('username found: ' + user.username);
            console.log(passwordEntered);
            
            if(err){
                console.log(err);
            } else {
                console.log("Comparing entered password and saved password right now.......");
                
                var result = " ";
                
                bcrypt.compare(passwordEntered, hash, function(err, res) {
                        
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
                       
                });
                
                response.json({message: result});
                
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
    
    .post('/setLight/', function(req, res, next){   //THE ID PARAM WAS REMOVED FOR TESTING, ADD IT BACK WHEN THE DB IS READY
        
        console.log("Set light route has been reached!");
        
        switch (req.body.currentLight) {
                    
                    case '1':
                        // code
                        board.analogWrite(11, 51);
                        res.send("Light has been set to 51!");
                        break;
                    
                    case '2':
                        // code
                        board.analogWrite(11, 102);
                        res.send("Light has been set!");
                        break;
                    
                    case '3':
                        // code
                        board.analogWrite(11, 153);
                        res.send("Light has been set!");
                        break;
                    
                    case '4':
                        // code
                        board.analogWrite(11, 204);
                        res.json("Light has been set!");
                        break;
                    
                    case '5':
                        // code
                        board.analogWrite(11, 255);
                        res.json("Light has been set!");
                        break;
                    
                    case '0':
                        // code
                    board.analogWrite(11, 0);
                    res.json("Light has been set!");
                }
        
        // plant.findById(req.params._id, function(err, Plant) {
        //     if (err) {
        //         res.send(err);
        //         console.log(err);
        //         throw err;
        //     } else {
        //         var plantBeforeUpdate = new plant();
        //         plantBeforeUpdate._id = Plant._id;
        //         plantBeforeUpdate.plantName = Plant.plantName;
        //         plantBeforeUpdate.plantType = Plant.plantType;
        //         plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
        //         plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
        //         plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
        //         plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
        //         plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
        //         plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
        //         plantBeforeUpdate.minLight = Plant.minLight;
        //         plantBeforeUpdate.currentLight = Plant.currentLight;
        //         plantBeforeUpdate.maxLight = Plant.maxLight;
                
        //         console.log(plantBeforeUpdate.currentLight);
                
        //         switch (plantBeforeUpdate.currentLight) {
                    
        //             case '1':
        //                 // code
        //                 board.analogWrite(11, 51);
        //                 res.send("Light has been set!");
        //                 break;
                    
        //             case '2':
        //                 // code
        //                 board.analogWrite(11, 102);
        //                 res.send("Light has been set!");
        //                 break;
                    
        //             case '3':
        //                 // code
        //                 board.analogWrite(11, 153);
        //                 res.send("Light has been set!");
        //                 break;
                    
        //             case '4':
        //                 // code
        //                 board.analogWrite(11, 204);
        //                 res.send("Light has been set!");
        //                 break;
                    
        //             case '5':
        //                 // code
        //                 board.analogWrite(11, 255);
        //                 res.send("Light has been set!");
        //                 break;
                    
        //             default:
        //                 // code
        //             board.analogWrite(11, 0);
        //             res.send("Light has been set!");
        //         }
                
        //     }
        // });
    })
    
    .post('/setMoisture/:_id', function(req, res, next){
        plant.findById(req.params._id, function(err, Plant) {
            if (err) {
                res.send(err);
            } else {
                var plantBeforeUpdate = new plant();
                plantBeforeUpdate._id = Plant._id;
                plantBeforeUpdate.plantName = Plant.plantName;
                plantBeforeUpdate.plantType = Plant.plantType;
                //plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
                plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
                //plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
                //plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
                plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
                //plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
                //plantBeforeUpdate.minLight = Plant.minLight;
                plantBeforeUpdate.currentLight = Plant.currentLight;
                //plantBeforeUpdate.maxLight = Plant.maxLight;
                
                switch (plantBeforeUpdate.currentMoisture) {
                    case '1':
                        // code
                        //board.analogWrite(12, 51)
                        break;
                            
                    case '2':
                        // code
                        //board.analogWrite(12, 102)
                        break;
                            
                    case '3':
                        // code
                        //board.analogWrite(12, 153)
                        break;
                            
                    case '4':
                        // code
                        //board.analogWrite(12, 204)
                        break;
                            
                    case '5':
                        // code
                        //board.analogWrite(12, 255)
                        break;
                            
                    default:
                        // code
                        //board.analogWrite(12, 0)
                }
            }
        });
    })
    
    .post('/setTemperature/:_id', function(req, res, next){
        plant.findById(req.params._id, function(err, Plant) {
            if (err) {
                res.send(err);
            } else {
                var plantBeforeUpdate = new plant();
                plantBeforeUpdate._id = Plant._id;
                plantBeforeUpdate.plantName = Plant.plantName;
                plantBeforeUpdate.plantType = Plant.plantType;
                //plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
                plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
                //plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
                //plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
                plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
                //plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
                //plantBeforeUpdate.minLight = Plant.minLight;
                plantBeforeUpdate.currentLight = Plant.currentLight;
                //plantBeforeUpdate.maxLight = Plant.maxLight;
                
                switch (plantBeforeUpdate.currentMoisture) {
                    case '1':
                        // code
                        //board.analogWrite(13, 51)
                        break;
                            
                    case '2':
                        // code
                        //board.analogWrite(13, 102)
                        break;
                            
                    case '3':
                        // code
                        //board.analogWrite(13, 153)
                        break;
                            
                    case '4':
                        // code
                        //board.analogWrite(13, 204)
                        break;
                            
                    case '5':
                        // code
                        //board.analogWrite(13, 255)
                        break;
                            
                    default:
                        // code
                }
            }
        });
    })
    
    .post('/updatePlantInfo/:_id', function(req, res, next){
        plant.findById(req.params._id, function(err, Plant) {
            if (err) {
                res.send(err);
            } else {
                var plantBeforeUpdate = new plant();
                plantBeforeUpdate._id = Plant._id;
                plantBeforeUpdate.plantName = Plant.plantName;
                plantBeforeUpdate.plantType = Plant.plantType;
                //plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
                plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
                //plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
                //plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
                plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
                //plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
                //plantBeforeUpdate.minLight = Plant.minLight;
                plantBeforeUpdate.currentLight = Plant.currentLight;
                //plantBeforeUpdate.maxLight = Plant.maxLight;
                
            }
        });
        
    })
    
    .get('/getLight/', function(req, res, next){
        var lightReading;
        // "data" get the current reading from the photoresistor
        photoResistor.on("data", function() {
            
            lightReading = this.value;
            console.log(lightReading);
            res.json({light: lightReading});
        });
        
            
            
        // plant.findById(req.params._id, function(err, Plant) {
        //     if (err) {
        //         res.send(err);
        //     } else {
        //         var plantBeforeUpdate = new plant();
        //         plantBeforeUpdate._id = Plant._id;
        //         plantBeforeUpdate.plantName = Plant.plantName;
        //         plantBeforeUpdate.plantType = Plant.plantType;
        //         plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
        //         plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
        //         plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
        //         plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
        //         plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
        //         plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
        //         plantBeforeUpdate.minLight = Plant.minLight;
        //         plantBeforeUpdate.currentLight = Plant.currentLight;
        //         plantBeforeUpdate.maxLight = Plant.maxLight;
                
        //         plantBeforeUpdate.currentLight = board.analogRead(11)
        //         res.json({currentLight: plant})
                
        //     }
        // });
    })
    
    .get('/moistureInfo/:_id', function(req, res, next){
        plant.findById(req.params._id, function(err, Plant) {
            if (err) {
                res.send(err);
            } else {
                var plantBeforeUpdate = new plant();
                plantBeforeUpdate._id = Plant._id;
                plantBeforeUpdate.plantName = Plant.plantName;
                plantBeforeUpdate.plantType = Plant.plantType;
                //plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
                plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
                //plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
                //plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
                plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
                //plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
                //plantBeforeUpdate.minLight = Plant.minLight;
                plantBeforeUpdate.currentLight = Plant.currentLight;
                //plantBeforeUpdate.maxLight = Plant.maxLight;
            }
        });
    })
    
    .get('/temperatureInfo/:_id', function(req, res, next){
        plant.findById(req.params._id, function(err, Plant) {
            if (err) {
                res.send(err);
            } else {
                var plantBeforeUpdate = new plant();
                plantBeforeUpdate._id = Plant._id;
                plantBeforeUpdate.plantName = Plant.plantName;
                plantBeforeUpdate.plantType = Plant.plantType;
                //plantBeforeUpdate.minTemperature = Plant.minTemperature; //the temp that the user set from their mobile app
                plantBeforeUpdate.currentTemperature = Plant.currentTemperature;
                //plantBeforeUpdate.maxTemperature = Plant.maxTemperature;
                //plantBeforeUpdate.minMoisture = Plant.minMoisture;   //the moisture setting that the user set from their mobile app
                plantBeforeUpdate.currentMoisture = Plant.currentMoisture;
                //plantBeforeUpdate.maxMoisture = Plant.maxMoisture;
                //plantBeforeUpdate.minLight = Plant.minLight;
                plantBeforeUpdate.currentLight = Plant.currentLight;
                //plantBeforeUpdate.maxLight = Plant.maxLight;
            }
        });
    })
    
    .get('/retrievePlantInfo/:_id', function(req, res, next){
        
        console.log("Plant " + req.params._id + " info is being requested");
        
        Plant.find({ _id: req.params._id }, function(err, plant){
            if(err){
                console.log(err);
                throw err;
            } else {
                console.log(plant);
                res.json(plant[0]);
            }
        });
        
    })
    
    .get('/listPlants', function(req, res, next){       //this function will list the plant names
        
        console.log("The list of plants is being requested...");
    
        Plant.find(function(err, Plants){
            if(err){
               console.log(err);
               throw err;
            } else {
                
            var array = [];
               
            for(var i in Plants){
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

}); //this is the closing brackets of the board("ready") function,  just doing this to check smthn