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

        
        //UNCOMMENT BELOW AFTER TESTING

  // Create a standard `led` component instance
  //var led = new five.Led(13);
  
  var currentLight;
  var currentTemperature;
  
  board.pinMode(3, five.Pin.PWM);
  board.pinMode(5, five.Pin.PWM);
  board.pinMode(6, five.Pin.PWM);
  board.pinMode(10, five.Pin.PWM);
  
  const heatingPad = new five.Pin(9);
  
  
  //board.pinMode(12, five.Pin.OUTPUT);
  
  var photoResistor0 = new five.Sensor("A0");
  var photoResistor1 = new five.Sensor("A1");
  var photoResistor2 = new five.Sensor("A2");
  var photoResistor3 = new five.Sensor("A3");
  
  const temperatureSensor = new five.Sensor({
    pin: 'A4'
  });
  
  photoResistor1.on('change', function() {
      var lightReading = this.value; //this.scaleTo(0,255);
     // console.log(lightReading);
  });
  
  var tempReading;
  
  temperatureSensor.on('change', (value) => {
    
            let Vo = value;
            const R1 = 10000;
            let logR2, R2, T;
            const c1 = 1.009249522e-03;
            const c2 = 2.378405444e-04;
            const c3 = 2.019202697e-07;
            R2 = R1 * (1023.0 / Vo - 1.0);
            logR2 = Math.log(R2);
            T = (1.0 / (c1 + c2 * logR2 + c3 * logR2 * logR2 * logR2));
            T = T - 273.15;
            T = (T * 9.0) / 5.0 + 32.0;
            T = (T - 32) * (5 / 9);
            
            tempReading = T.toFixed(2);
            console.log("Temperature: " + tempReading);
        });
        
        heatingPad.on("high", function(){
            console.log("Heating pad set to high!!!!!");
        });
        
        heatingPad.on("low", function(){
            console.log("Heating pad set to low!!!!!");
        });
        
        photoResistor1.on("data", function() {
          var lightReading1 = this.scaleTo(0, 255);
          var lightLevel = currentLight;
          console.log("LightReading3 "+lightReading1)
          //  console.log("Photoresistor3: " + lightReading3);
          var lightOutput0 = (parseInt(lightLevel) * 51) - (lightReading1 / 4);
          var lightOutput1 = (parseInt(lightLevel) * 51) - (lightReading1 / 4);
          var lightOutput2 = (parseInt(lightLevel) * 51) - (lightReading1 / 4);
          var lightOutput3 = (parseInt(lightLevel) * 51) - (lightReading1 / 4);
          
          console.log("lightOutput0: "+lightOutput0)
          console.log("lightOutput1: "+lightOutput1)
          console.log("lightOutput2: "+lightOutput2)
          console.log("lightOutput3: "+lightOutput3)
          
                    if (lightOutput0 > 0 && lightOutput0 <= 255) {
                        board.analogWrite(3, lightOutput0);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(3,255);
                    } else {
                        board.analogWrite(3, 0);
                    }
                    
                    if (lightOutput1 > 0 && lightOutput1 <= 255) {
                        board.analogWrite(5, lightOutput1);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(5,255);
                    } else {
                        board.analogWrite(5, 0);
                    }
                    
                    if (lightOutput2 > 0 && lightOutput2 <= 255) {
                        board.analogWrite(6, lightOutput2);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(6,255);
                    } else {
                        board.analogWrite(6, 0);
                    }
                    
                    if (lightOutput3 > 0 && lightOutput3 <= 255) {
                        board.analogWrite(10, lightOutput3);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(10,255);
                    } else {
                        board.analogWrite(10, 0);
                    }
        });
  
    /*Board loop implementation*/
    /*board.loop(1000, () => {
        var lightReading0;
        var lightReading1;
        var lightReading2;
        var lightReading3;
        
        
        
        photoResistor0.on("data", function() {
            lightReading0 = this.scaleTo(0, 255);
            //console.log("Photoresistor0: " + lightReading0);
        });
        photoResistor1.on("data", function() {
            lightReading1 = this.scaleTo(0, 255);
            //console.log("Photoresistor1: " + lightReading1);
        });
        photoResistor2.on("data", function() {
            lightReading2 = this.scaleTo(0, 255);
            //console.log("Photoresistor2: " + lightReading2);
        });
        photoResistor3.on("data", function() {
          lightReading3 = this.scaleTo(0, 255);
          /*var lightLevel = currentLight;
          //  console.log("Photoresistor3: " + lightReading3);
          var lightOutput0 = (lightReading3 / 4) - (parseInt(lightLevel) * 51);
          var lightOutput1 = (lightReading3 / 4) - (parseInt(lightLevel) * 51);
          var lightOutput2 = (lightReading3 / 4) - (parseInt(lightLevel) * 51);
          var lightOutput3 = (lightReading3 / 4) - (parseInt(lightLevel) * 51);
          
          if (lightOutput0 > 0 && lightOutput0 <= 255) {
                        board.analogWrite(3, lightOutput0);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(3,255);
                    } else {
                        board.analogWrite(3, 0);
                    }
                    if (lightOutput1 > 0 && lightOutput1 <= 255) {
                        board.analogWrite(5, lightOutput1);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(5,255);
                    } else {
                        board.analogWrite(5, 0);
                    }
                    if (lightOutput2 > 0 && lightOutput2 <= 255) {
                        board.analogWrite(6, lightOutput2);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(6,255);
                    } else {
                        board.analogWrite(6, 0);
                    }
                    if (lightOutput3 > 0 && lightOutput3 <= 255) {
                        board.analogWrite(11, lightOutput3);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(11,255);
                    } else {
                        board.analogWrite(11, 0);
                    }
                    
                    if(tempReading < 30) {
                        heatingPad.high();
                    } else {
                        heatingPad.low();
                    }
        });
        
        
        if(tempReading < 30){
            heatingPad.high();
        } else {
            heatingPad.low();
        }
        
        /*plant.find({}).toArray(function(plantArray) {
                for(var p in plantArray) {
                    var lightLevel = currentLight;
                    var tempLevel = currentTemperature;
                    
                    console.log("currentLight:"+currentLight);
                    
                    var lightOutput0 = (lightReading0 / 4) - (parseInt(lightLevel) * 51);
                    var lightOutput1 = (lightReading1 / 4) - (parseInt(lightLevel) * 51);
                    var lightOutput2 = (lightReading2 / 4) - (parseInt(lightLevel) * 51);
                    var lightOutput3 = (lightReading3 / 4) - (parseInt(lightLevel) * 51);
                    
                    console.log("lightOutput0: "+lightOutput0)
                    console.log("lightOutput1: "+lightOutput1)
                    console.log("lightOutput2: "+lightOutput2)
                    console.log("lightOutput3: "+lightOutput3)
                    
                    if (lightOutput0 > 0 && lightOutput0 <= 255) {
                        board.analogWrite(3, lightOutput0);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(3,255);
                    } else {
                        board.analogWrite(3, 0);
                    }
                    if (lightOutput1 > 0 && lightOutput1 <= 255) {
                        board.analogWrite(5, lightOutput1);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(5,255);
                    } else {
                        board.analogWrite(5, 0);
                    }
                    if (lightOutput2 > 0 && lightOutput2 <= 255) {
                        board.analogWrite(6, lightOutput2);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(6,255);
                    } else {
                        board.analogWrite(6, 0);
                    }
                    if (lightOutput3 > 0 && lightOutput3 <= 255) {
                        board.analogWrite(11, lightOutput3);
                    } else if (lightOutput0 > 255) {
                        board.analogWrite(11,255);
                    } else {
                        board.analogWrite(11, 0);
                    }
                    
                    if(tempReading < 30) {
                        heatingPad.high();
                    } else {
                        heatingPad.low();
                    }
                //}
            //});
            
        });*/


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
        
        currentLight = req.body.currentLight;
        
        switch (currentLight) {
                    
                    case '1':
                        // code
                        board.analogWrite(3, 51);
                        board.analogWrite(5, 51);
                        board.analogWrite(6, 51);
                        board.analogWrite(10, 51);
                        res.send("Light has been set to 51!");
                        break;
                    
                    case '2':
                        // code
                        board.analogWrite(3, 102);
                        board.analogWrite(5, 102);
                        board.analogWrite(6, 102);
                        board.analogWrite(10, 102);
                        res.send("Light has been set!");
                        break;
                    
                    case '3':
                        // code
                        board.analogWrite(3, 153);
                        board.analogWrite(5, 153);
                        board.analogWrite(6, 153);
                        board.analogWrite(10, 153);
                        res.send("Light has been set!");
                        break;
                    
                    case '4':
                        // code
                        board.analogWrite(3, 204);
                        board.analogWrite(5, 204);
                        board.analogWrite(6, 204);
                        board.analogWrite(10, 204);
                        res.json("Light has been set!");
                        break;
                    
                    case '5':
                        // code
                        board.analogWrite(3, 255);
                        board.analogWrite(5, 255);
                        board.analogWrite(6, 255);
                        board.analogWrite(10, 255);
                        res.json("Light has been set!");
                        break;
                    
                    default:
                    
                    case '0':
                        // code
                        board.analogWrite(3, 0);
                        board.analogWrite(5, 0);
                        board.analogWrite(6, 0);
                        board.analogWrite(10, 0);
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
        res.json({currentLight: 'currentLight Has been set'});
    })
    
    .post('/setMoisture/:_id', function(req, res, next){
        /*plant.findById(req.params._id, function(err, Plant) {
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
        });*/
    })
    
    .post('/setTemperature/:_id', function(req, res, next){
        
        
        /*plant.findById(req.params._id, function(err, Plant) {
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
                
                multiSensor.on("data", function(){
                    temperatureReading = this.thermometer.celsius;
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
        });*/
    })
    
    .post('/updatePlantInfo/:_id', function(req, res, next){
        /*plant.findById(req.params._id, function(err, Plant) {
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
        });*/
        
        currentLight = req.body.currentLight;
        currentTemperature = req.body.currentTemperature;
        
        switch (currentLight) {
                    
                    case '1':
                        // code
                        board.analogWrite(3, 51);
                        board.analogWrite(5, 51);
                        board.analogWrite(6, 51);
                        board.analogWrite(10, 51);
                        res.send("Light has been set to 51!");
                        break;
                    
                    case '2':
                        // code
                        board.analogWrite(3, 102);
                        board.analogWrite(5, 102);
                        board.analogWrite(6, 102);
                        board.analogWrite(10, 102);
                        res.send("Light has been set!");
                        break;
                    
                    case '3':
                        // code
                        board.analogWrite(3, 153);
                        board.analogWrite(5, 153);
                        board.analogWrite(6, 153);
                        board.analogWrite(10, 153);
                        res.send("Light has been set!");
                        break;
                    
                    case '4':
                        // code
                        board.analogWrite(3, 204);
                        board.analogWrite(5, 204);
                        board.analogWrite(6, 204);
                        board.analogWrite(10, 204);
                        res.json("Light has been set!");
                        break;
                    
                    case '5':
                        // code
                        board.analogWrite(3, 255);
                        board.analogWrite(5, 255);
                        board.analogWrite(6, 255);
                        board.analogWrite(10, 255);
                        res.json("Light has been set!");
                        break;
                    
                    default:
                    
                    case '0':
                        // code
                        board.analogWrite(3, 0);
                        board.analogWrite(5, 0);
                        board.analogWrite(6, 0);
                        board.analogWrite(10, 0);
                    res.json("Light has been set!");
        }
        
        res.json({light: currentLight});
    })
    
    
    .get('/getLight/', function(req, res, next){
        /*var lightReading;
        
        
        // "data" get the current reading from the photoresistor
        photoResistor0.on("data", function() {
            lightReading = this.value;//.scaleTo(0, 255);
        });
        
        setTimeout(function(){
            res.json({light: lightReading});  
        }, 3000);
          
            
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
        // });*/
    })
    
    .get('/moistureInfo/:_id', function(req, res, next){
        /*plant.findById(req.params._id, function(err, Plant) {
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
                
                /*multiSensor.on("data", function(){
                    moistureReading = this.hygrometer.relativeHumidity;
                });
                setTimeout(function(){
                    res.json({moisture: moistureReading});  
                }, 3000);
            }
        });*/
    })
    
    .get('/temperatureInfo/:_id', function(req, res, next){
        /*plant.findById(req.params._id, function(err, Plant) {
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
                
                /*multiSensor.on("data", function(){
                    temperatureReading = this.thermometer.celsius;
                });
                setTimeout(function(){
                    res.json({temperature: temperatureReading});  
                }, 3000);
                
            }
        });*/
    })
    
    .get('/retrievePlantInfo/:_id', function(req, res, next){
        
        console.log("Plant " + req.params._id + " info is being requested");
        
        /*Plant.find({ _id: req.params._id }, function(err, plant){
            if(err){
                console.log(err);
                throw err;
            } else {
                console.log(plant);
                res.json(plant[0]);
            }
        });*/
        
        var plant = new Plant();
        
        if(currentLight && currentTemperature){
            
            plant.plantName = "Delilah";
            plant.plantType = "cactus";
            plant.minTemperature = "N/A";
            plant.currentTemperature = currentTemperature;
            plant.maxTemperature = "N/A";
            plant.minMoisture = "N/A";
            plant.currentMoisture = "N/A";
            plant.maxMoisture = "N/A";
            plant.minLight = "N/A";
            plant.currentLight = currentLight;
            plant.maxLight = "N/A";
        } else {
            plant.plantName = "Delilah";
            plant.plantType = "cactus";
            plant.minTemperature = "N/A";
            plant.currentTemperature = "23";
            plant.maxTemperature = "N/A";
            plant.minMoisture = "N/A";
            plant.currentMoisture = "N/A";
            plant.maxMoisture = "N/A";
            plant.minLight = "N/A";
            plant.currentLight = "1";
            plant.maxLight = "N/A";
            
            currentTemperature = 23;
            currentLight = 1;
        }
        
        res.json(plant);
        
    })
    
    .get('/listPlants', function(req, res, next){       //this function will list the plant names
        
        console.log("The list of plants is being requested...");
    
        /*Plant.find(function(err, Plants){
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
        });*/
    });
   
    
        app.listen(port, function() 
    {
        console.log('The server is listening on port ' + port);
    });
    

}); //this is the closing brackets of the board("ready") function,  just doing this to check smthn