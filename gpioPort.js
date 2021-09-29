var ONE_WIRE=4;
var config = require('./config.json');
if(config.NODE_ENV=='debug') {
  var wpi = require('./wiring-piMock');
}
else {
  var wpi = require('rpio');
}

var TaskQueue = require('./TaskQueue');
 var taskQueue = new TaskQueue(pulsePin);
//Associate pin numbers with their
//physical position on the chip
//wpi.init('phys');
//set temperature sensor pin to input mode
wpi.open(ONE_WIRE,wpi.INPUT); //pinMode
//set temperature sensor pin's pull up resistor
wpi.pud(ONE_WIRE, wpi.PULL_UP) ;

function setGpioPins(portDictionary) {
  for (var key in portDictionary) {
    //configure all pins as outputs
    wpi.mode(portDictionary[key], wpi.OUTPUT); //pinMode
  }
}

function pulsePin(taskParams,cb) {
  wpi.write(taskParams.Pin, wpi.HIGH); //digitalWrite
  setTimeout(function () {
    wpi.write(taskParams.Pin, wpi.LOW);
    cb();
  }, taskParams.Delay);
}

function queuePulse(pin, delay) {
   taskQueue.queueTask({ "Pin": pin, "Delay": delay });
 }

module.exports = {
  setGpioPins: setGpioPins,
 queuePulse: queuePulse
};
