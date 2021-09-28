var ONE_WIRE=4;
var config = require('./config.json');
if(config.NODE_ENV=='debug') {
  var wpi = require('./wiring-piMock');
}
else {
  var wpi = require('wiringpi-node');
}

var TaskQueue = require('./TaskQueue');
 var taskQueue = new TaskQueue(pulsePin);
//Associate pin numbers with their
//physical position on the chip
wpi.setup('phys');
//set temperature sensor pin to input mode
wpi.pinMode(ONE_WIRE,wpi.INPUT);
//set temperature sensor pin's pull up resistor
wpi.pullUpDnControl (ONE_WIRE, wpi.PUD_UP) ;

function setGpioPins(portDictionary) {
  for (var key in portDictionary) {
    //configure all pins as outputs
    wpi.pinMode(portDictionary[key], wpi.OUTPUT);
  }
}

function pulsePin(taskParams,cb) {
  wpi.digitalWrite(taskParams.Pin, wpi.HIGH);
  setTimeout(function () {
    wpi.digitalWrite(taskParams.Pin, wpi.LOW);
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
