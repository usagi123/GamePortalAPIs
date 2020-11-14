const moment = require('moment');

var eventStart = moment('07:00:00 01-11-2020', 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh');
var currentT = moment('07:00:00 12-11-2020', 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh');
var eventEnd = moment('07:00:00 10-11-2020', 'HH:mm:ss DD-MM-YYYY Asia/Ho_Chi_Minh');

var currentD = moment().unix();
var eventStartUnix = moment(eventStart).unix();
var currentTUnix = moment(currentT).unix();
var eventEndUnix = moment(eventEnd).unix();

//console.log(moment(currentT).isBetween(eventStart, eventEnd));
//console.log(moment(currentT).isBefore(eventStart));

console.log(eventStartUnix);
console.log(currentTUnix);
console.log(eventEndUnix);

console.log(moment.unix(currentD).format('HH:mm:ss DD-MM-YYYY'));
console.log(moment.unix(eventStartUnix).format('HH:mm:ss DD-MM-YYYY'));
console.log(moment.unix(currentTUnix).format('HH:mm:ss DD-MM-YYYY'));
console.log(moment.unix(eventEndUnix).format('HH:mm:ss DD-MM-YYYY'));


if(moment(currentT).isBefore(eventStart) || moment(currentT).isBetween(eventStart, eventEnd)) {
    console.log("Display event")
} else {
    console.log("Don't display event")
}

//logic (currentT <= eventStart OR (eventStart <= currentT AND currentT <= eventEnd))
if(moment(currentT).unix() <= moment(eventStart).unix() || (moment(eventStart).unix() <= moment(currentT).unix() && moment(currentT).unix() <= moment(eventEnd).unix())) {
    console.log("Display event")
} else {
    console.log("Don't display event")
}