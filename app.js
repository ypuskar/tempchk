
var sse = require('./sse');
var express = require("express");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var pg = require('pg');
var app = express();
//var gpio = require('./gpioPort');
var config = require('./config.json');
var handlers = require('./handlers/handlers');
const jsn = express.json();
//All JS and CSS files are in the Scripts folder.


const ServerStartTime = (() => {
    var sTime = new Date();
    return () => {return sTime};
} )();


handlers.historyCount();
handlers.heatperiodCount();

//app.use(jsn());
//app.use(jsn.urlencoded({extended: true}));

app.use(morgan('dev'));

app.use(express.static(__dirname + '/build'));

//add cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//this is a json object used as a key/value dictionary
//to associate descriptive words with  gpio pin numbers
//var portDictionary = { alarm: 11, heat: 12, light: 13, tv: 14 };
//gpio.setGpioPins(portDictionary);
//750 millisecs
var pulseLength = 25;


if (config.NODE_ENV !== 'debug') {
    //check temp and switch heating
    var runTemp = setInterval(sse.readAllTemp, 5000, 6, 6+2); 
    //save data every hour to db
    var runSave = setInterval(saveData, 3600000);
    } else {
        console.log('Debug mode on');
    }





 
//this is the server sent event socket
//the client calls this to both subscribe and unsubscribe
app.get('/sse', function (req, res) {
    
    if (req.headers.accept && req.headers.accept == 'text/event-stream') {
        //the following runs synchronously
        //when the client's close event is emitted (fired)
        req.on('close', function () {
            sse.removeSubscriber(res);
            res = null;
        });
        if (res != null) {
            sse.addSubscriber(req, res);
        }

    } else {
        res.writeHead(404).send('Subscription error');
        res.end();
    }
});

//get historical temperatures
app.get('/temps/:times', (req, res) => {

    var timePeriod = decodeURIComponent(req.params.times);
    if(Object.keys(req.query).length !== 0 ) {
        console.log(req.query.limit);
    }
    handlers.getTemps(req,res);
});

//get historical heatperiods
app.get('/period/:times', (req, res) => {

    var timePeriod = decodeURIComponent(req.params.times);
    if(Object.keys(req.query).length !== 0 ) {
        console.log(req.query.limit);
    }
    handlers.getPeriod(req, res);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/build/index.html');

});

// '/:pinName' traps  post requests to /alarm, /tv etc
//and places the last word in a req parameter 'pinName'
app.post('/:pinName', function (req, res) {
    var pinName = req.params.pinName;
    var portNumber = portDictionary[pinName];
    if (portNumber) {
        //The pin is pulsed asynchronously
        //but only one pin can be pulsed at a time
        //because the remote control can only send one
        //pulse at a time. So calls to this are queued.
        //gpio.queuePulse(portNumber, pulseLength);
        saveData();
        //code 204 = No content
        res.status(204).end();
    }
    else {
        console.log("port requested is not found ");
        res.status(404).end();
    }
});
//send server start time
app.get('/sst', function (req, res) {
    var uptime = {};
    uptime.node = new Date().getTime() - process.uptime()*1000;
    uptime.server = new Date().getTime() - require('os').uptime()*1000;
    console.log(new Date(uptime.server), new Date(uptime.node));
    return res.status(201).send(uptime);

});

function startServer(port, messageInterval) {
    sse.setMessageInterval(messageInterval);
    console.log("Server listening on port " + port);
    var server = app.listen(port);
    return server;
}

function saveData () {

            //var tempObject = sse.tempObject();
            handlers.insertHistory(sse.tempObject());
            /*
            if (Object.getOwnPropertyNames(tempObject).length !== 0) {
                var tempValues = [];
                for (var prop in tempObject) {
                    tempValues.push(tempObject[prop]);
                    
                }
                //console.log(tempObject);
                db.query('INSERT INTO public."History"('+
                '"Temp_garaaz", "Kyte_garaaz",'+
                '"Temp_Leiliruum", '+
                '"Temp_Eesruum", "Kyte_eesruum",'+
                '"Temp_valjas"'+
                ') VALUES($1, $2, $3, $4, $5, $6);', tempValues, (err, table) => {
                
                    done();
                    if(err) {
                        console.log(err);
                    } else {
                        //console.log('INSERTED');
                        //db.end();
                    }
                }) 
                //db.end();
                //*/
}


module.exports = {
    startServer: startServer
};