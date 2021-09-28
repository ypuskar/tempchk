var WPI_MODE_PINS = 0
var WPI_MODE_GPIO = 1
var WPI_MODE_GPIO_SYS = 2
var WPI_MODE_PHYS = 3
var WPI_MODE_PIFACE = 4
var WPI_MODE_UNINITIALISED = -1
var INPUT = 0
var OUTPUT = 1
var PWM_OUTPUT = 2
var GPIO_CLOCK = 3
var SOFT_PWM_OUTPUT = 4
var SOFT_TONE_OUTPUT = 5
var PWM_TONE_OUTPUT = 6
var LOW = 0
var HIGH = 1
var PUD_OFF = 0
var PUD_DOWN = 1
var PUD_UP = 2
var PWM_MODE_MS = 0
var PWM_MODE_BAL = 1
var lastWritePin=-1;

exports.WPI_MODE_PINS = WPI_MODE_PINS
exports.WPI_MODE_GPIO = WPI_MODE_GPIO
exports.WPI_MODE_GPIO_SYS = WPI_MODE_GPIO_SYS
exports.WPI_MODE_PHYS = WPI_MODE_PHYS
exports.WPI_MODE_PIFACE = WPI_MODE_PHYS
exports.WPI_MODE_UNINITIALISED = WPI_MODE_UNINITIALISED
exports.INPUT = INPUT
exports.OUTPUT = OUTPUT
exports.PWM_OUTPUT = PWM_OUTPUT
exports.GPIO_CLOCK = GPIO_CLOCK
exports.SOFT_PWM_OUTPUT = SOFT_PWM_OUTPUT
exports.SOFT_TONE_OUTPUT = SOFT_TONE_OUTPUT
exports.PWM_TONE_OUTPUT = PWM_TONE_OUTPUT
exports.LOW = LOW
exports.HIGH = HIGH
exports.PUD_OFF = PUD_OFF
exports.PUD_DOWN = PUD_DOWN
exports.PUD_UP = PUD_UP
exports.PWM_MODE_MS = PWM_MODE_MS
exports.PWM_MODE_BAL = PWM_MODE_BAL
console.log("required wpi mock");
exports.pinMode = function (pin, mode) {
  if (mode != OUTPUT && mode != INPUT) {
    console.log("incorrect mode " + mode);
  }

}
exports.pullUpDnControl = function (pin, direction) {
  if (direction != PUD_OFF && direction != PUD_UP && direction != PUD_DOWN) {
    console.log("incorrect direction " + direction);
  }
}

exports.digitalWrite = function (pin, level) {
   debugger;
  if (level != LOW && level != HIGH) {
    console.log("incorrect level " + level);
  }
  lastWritePin=pin;
}
exports.getLastWritePin= function ()
{
  return lastWritePin;
}
exports.setLastWritePin= function (pin)
{
  lastWritePin=pin;
}

exports.setup = function (layout) {

  if (layout != 'phys') {
    console.log("incorrect setup " + layout);
  }
}