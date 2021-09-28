// to run, enter: 
//npm test
var expect = require("chai").expect;
var request = require("request");
var EventSource = require("eventsource");

var app = require("../app");
var wpi = require('../wiring-piMock');
var sse = require('../sse');
var TaskQueue = require('../TaskQueue');

describe('HomeAuto tests..', function () {
  this.timeout(10000);
  var server;
  before(function () {
    // runs once before any tests are started
    server = app.startServer(3000, 50);
  });
  after(function () {
    // runs after all tests are complete
    server.close();
    console.log("server closed");
  });

  describe("Post requests", function () {
    describe("POST/tv request", function () {
      it("writes to gpio pin 14", function (done) {
        wpi.setLastWritePin(-1);
        request.post(
          'http://localhost:3000/tv'
        );
        setTimeout(function () {
          var pin = wpi.getLastWritePin();
          expect(pin).to.equal(14);
          done();
        }, 100);
      });
    });
  });

  describe("Server Sent Events", function () {
    describe("/sse request", function () {
      it("generates a response containing multiple messages", function (done) {
        var eventSource = new EventSource("http://localhost:3000/sse");
        var count = 0;
        eventSource.onmessage = function (event) {
          count += 1;
        }
        setTimeout(function () {
          expect(count).to.be.greaterThan(1);
          done();
        }, 250);

      });
    });
  });

  describe("Task Queue", function () {
    describe("queueTask", function () {
      it("queues async tasks and executes them sequentially", function (done) {
        var pins = [];
        var expectedPins = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
         //used to save the pin numbers in the order
        //that they are received
        function testSequence(taskParams, cb) {
          pins.push(taskParams.Pin);
          setTimeout(function () {
            pins.push(taskParams.Pin);
            cb();
          }, taskParams.Delay);
        }
        var taskQ = new TaskQueue(testSequence);
        var delay = 10;
        for (var i = 1; i <= 5; i++) {
          taskQ.queueTask({ "Pin": i, "Delay": delay });
        }
        setTimeout(function () {
          expect(pins).to.deep.equal(expectedPins);
          done();
        }, 100);
      });
    });
  });

});

