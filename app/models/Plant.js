var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantSchema = new Schema({
    plantName: String,
    plantID: String,
    plantSpeciesName: String,
    minTemperature: String, //the temp that the user set from their mobile app
    maxTemperature: String,
    minMoisture: String,    //the moisture setting that the user set from their mobile app
    maxMoisture: String,
    minLight: String,
    maxLight: String, //the light setting that the user set from their mobile app
    pictureURL: String
}); 

var Plant = mongoose.model('Plant', PlantSchema);
module.exports = Plant;