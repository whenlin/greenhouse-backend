var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlantSchema = new Schema({
    plantName: String,
    plantID: String,
    plantSpeciesName: String,
    temperatureSetting: String, //the temp that the user set from their mobile app
    moistureSetting: String,    //the moisture setting that the user set from their mobile app
    lightSetting: String,       //the light setting that the user set from their mobile app
    pictureURL: String
}); 

var Plant = mongoose.model('Plant', PlantSchema);
module.exports = Plant;