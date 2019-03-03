var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantSchema = new Schema({
    plantName: String,
    plantType: String,
    minTemperature: String, //the temp that the user set from their mobile app
    currentTemperature: String,
    maxTemperature: String,
    minMoisture: String,    //the moisture setting that the user set from their mobile app
    currentMoisture: String,
    maxMoisture: String,
    minLight: String,
    currentLight: String,
    maxLight: String //the light setting that the user set from their mobile app
}); 

var Plant = mongoose.model('Plant', PlantSchema);
module.exports = Plant;