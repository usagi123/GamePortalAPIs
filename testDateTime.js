const moment = require('moment');

var eventStart = "2020-12-02 18:00:00";
var currentT = "2020-12-21 18:00:00";
var eventEnd = "2020-12-20 18:00:00";
var currentD = moment();

//console.log(moment(currentT).isBetween(eventStart, eventEnd));
//console.log(moment(currentT).isBefore(eventStart));

if(moment(currentT).isBefore(eventStart) || moment(currentT).isBetween(eventStart, eventEnd)) {
    console.log("Display event")
} else {
    console.log("Don't display event")
}