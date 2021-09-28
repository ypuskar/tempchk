var config = require('./config.json');
var handlers = require('./handlers/handlers');

var maxTemp = 27;
var minTemp = maxTemp - 3;
var roomTemp = {
  '28-0517c3a351ff': 
    {
    temp: NaN,
    heat: false,
    HeatStart: 0,
    HeatEnd: 0
    },
  '28-0417c2a85dff':
  {
    temp: NaN,
    heat: false,
    HeatStart: 0,
    HeatEnd: 0
    },
  '28-0417c28ee3ff':
  {
    temp: NaN,
    heat: false
  },
  '28-0417c2da95ff':
  {
    temp: NaN,
    heat: false
  },
};



var tempObjectid = {
  Garaaz: '28-0517c3a351ff',
  Eesruum : '28-0417c2a85dff'
};
//roomTemp['28-0517c3a351ff'] = {};
//roomTemp['28-0417c2a85dff'] = {};

//roomTemp['28-0517c3a351ff'].HeatStart = 0;
//roomTemp['28-0517c3a351ff'].HeatEnd = 0;
//roomTemp['28-0417c2a85dff'].HeatStart = 0;
//roomTemp['28-0417c2a85dff'].HeatEnd = 0;

console.log(roomTemp);
var roomTempState = {
  TestState: false,
  GaraazState: false,
  EesruumState: false
};
if (config.NODE_ENV == 'debug') {
  var sensor = require('./ds18x20Mock.js');
  var sensorId = '28-000007d4684f';
  roomTemp[sensorId]={};

}
else {
  var sensor = require('ds18x20');
  var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
  var garaaziKyte = new Gpio(17, 'out'); //use GPIO pin 17, and specify that it is output
  //var blinkInterval = setInterval(blinkLED, 500); //run the blinkLED function every 250ms
  var eesruumiKyte = new Gpio(22, 'out');
  var ledswitch = false;
}

var sendInterval = 5000;//millisecs
var subscribers = [];
var cancellationToken;
var blinkInterval
//***need to add your own sensor's Id****
// The id of the sensor can be found in  /sys/bus/w1/devices/ 
// It will start with  '28-' as in the example below
//var sensorId = ['28-0417c28ee3ff','28-0517c3a351ff'];
//var sensorId = ['28-0417c28ee3ff','28-0517c3a351ff'];
function setMessageInterval(millisecs) {
  sendInterval = millisecs;
}
function addSubscriber(req, res) {
  subscribers.push(res);
  res.writeHead(200,
    {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  );
  //send new client's first message  immediately
  writeMessage(res);
  //if cancellationToken is null or undefined
  if (!cancellationToken) {
    //The message pump is not running so
    //start it.  The timer's interval  function
    //runs until cancelled
    cancellationToken = setInterval(function () {
      messageAllSubscribers();
    }, sendInterval);
  }
}

function messageAllSubscribers() {
  subscribers.forEach(function (subscriberRes) {
    writeMessage(subscriberRes);
  });
}

function writeMessage(res) {
  if (config.NODE_ENV == 'debug') {
    sensor.get(sensorId, function (err, temp) {
      if (err) {
        console.log(err);
        return;
      }

      roomTemp[sensorId].temp = temp;
      roomTemp[sensorId].heat = (temp < 30) ? true : false;
      recordHeatStartEnd(roomTemp);
      
      //console.log(roomTemp);
      res.write("data: " + JSON.stringify(roomTemp) + '\n\n');
    });
  } else {
    res.write("data: " + JSON.stringify(roomTemp) + '\n\n'); //event message starts with data:

  }

/*  sensor.getAll(function (err, temp) {
    if (err) {
      console.log(err);
      return;
    }
    //console.log(temp);
    if ( ledswitch === false  &&  temp[1] >= maxTemp ) {
      ledswitch = true;
      //console.log('LEDON');

      blinkInterval = setInterval(blinkLED, 500); //run the blinkLED function every 250ms
      //console.log(typeof blinkInterval);
    } else if (ledswitch === true && (temp[1] < maxTemp ) ){
      //console.log('LEDOFF ' + temp[1]);
      ledswitch = false;

      endBlink();
    }
    //console.log( temp[0] );
    
    
  });*/
}

//The response object is actually a stream and has
// a constant reference value for a given connection.
// So it can be stored and reused.
function removeSubscriber(subscriberRes) {
  var i = subscribers.indexOf(subscriberRes);
  //if found
  if (i !== -1) {
    //remove from array
    subscribers.splice(i, 1);
  }
  //if no subscribers remain
  if (subscribers.length == 0 && cancellationToken) {
    //clear (stop) the interval timer
    clearInterval(cancellationToken);
    cancellationToken = null;
  }

}

/*function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

function endBlink() { //function to stop blinking
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  //LED.unexport(); // Unexport GPIO to free resources
}*/
//reads all sensor temps and creates global roomTemp object
function readAllTemp (minT, maxT) {
  sensor.getAll(function (err, temp) {
    if (err) {
      console.log(err);
      return;
    }
      //console.log(temp);
    for (var prop in temp) {
     // console.log(temp[prop]);

      
      if (temp[prop] <= minT) {
        //roomTemp[prop] = {temp: temp[prop], heat: true};
        roomTemp[prop].temp = temp[prop];
        roomTemp[prop].heat = true;
      // break;
        //console.log('TRUE ' +temp[prop]+' '+minT);
        //LED22.writeSync(1);
      }
      else if (temp[prop] >= maxT) {
        roomTemp[prop].temp = temp[prop];
        roomTemp[prop].heat = false;
        //roomTemp[prop] = {temp: temp[prop], heat: false};
        //console.log('FALSE ' +temp[prop]+' '+maxT); 
        //LED22.writeSync(0);  
      }
      else if (temp[prop] > minT && temp[prop] < maxT) {

       // console.log( prop +' '+tempObjectid.Garaaz);

        //first time execution needs object setup
        if (Object.keys(roomTemp).length < 2) {

          roomTemp[prop].temp = temp[prop];
          roomTemp[prop].heat = true;
          //roomTemp[prop] = {temp: temp[prop], heat: true};
          if(prop === '28-0517c3a351ff') {
            roomTemp['28-0517c3a351ff'].HeatStart = 0;
            roomTemp['28-0517c3a351ff'].HeatEnd = 0;

          } else if (prop === '28-0417c2a85dff'){
            roomTemp['28-0417c2a85dff'].HeatStart = 0;
            roomTemp['28-0417c2a85dff'].HeatEnd = 0;
          }
        }


        if (prop === tempObjectid.Garaaz && roomTemp[prop].heat === true) {
          
          roomTemp[prop].temp = temp[prop];
          roomTemp[prop].heat = true;
          
          //roomTemp[prop] = {temp: temp[prop], heat: true};
         // console.log('GARAAZ VAHEMIK +');
        } else if (prop === tempObjectid.Garaaz && roomTemp[prop].heat === false) {
          roomTemp[prop].temp = temp[prop];
          roomTemp[prop].heat = false;
          //roomTemp[prop] = {temp: temp[prop], heat: false};
          //console.log('GARAAZ VAHEMIK -');
        } else if (prop === tempObjectid.Eesruum && roomTemp[prop].heat === true) {
          roomTemp[prop].temp = temp[prop];
          roomTemp[prop].heat = true;
          //roomTemp[prop] = {temp: temp[prop], heat: true};
          //console.log('EESRUUM VAHEMIK +');
        } else if (prop === tempObjectid.Eesruum && roomTemp[prop].heat === false) {
          roomTemp[prop].temp = temp[prop];
          roomTemp[prop].heat = false;
          //roomTemp[prop] = {temp: temp[prop], heat: false};
          //console.log('EESRUUM VAHEMIK -');
        } 
        else if (prop != tempObjectid.Garaaz && prop != tempObjectid.Eesruum) {
          roomTemp[prop].temp = temp[prop];
          roomTemp[prop].heat = false;
          //roomTemp[prop] = {temp: temp[prop], heat: false};
          //console.log(tempObjectid.Garaaz + ' '+ tempObjectid.Eesruum+ ' '+prop);
          //console.log(JSON.stringify(roomTemp));
          //LED23.writeSync(0);
        }
      }

  }
  kyteSisse();
  recordHeatStartEnd(roomTemp);
  return roomTemp;
  });
} 

function tempObject() { 
  var tempObject = {
    Temp_garaaz: 0,
    Kyte_garaaz: false,
    Temp_Leiliruum: 0,
    
    Temp_Eesruum: 0,
    Kyte_eesruum: false,
    Temp_valjas: 0

  }
  for(var prop in roomTemp){
    
    switch(prop) {
      case '28-0517c3a351ff':
        tempObject.Temp_garaaz = roomTemp[prop].temp;
        tempObject.Kyte_garaaz = roomTemp[prop].heat;
        break;
      case '28-0417c2a85dff':
        tempObject.Temp_Eesruum = roomTemp[prop].temp;
        tempObject.Kyte_eesruum = roomTemp[prop].heat;
        break;
      case '28-0417c28ee3ff':
        tempObject.Temp_valjas = roomTemp[prop].temp;
        break;
      case '28-0417c2da95ff':
        tempObject.Temp_Leiliruum = roomTemp[prop].temp;
        break;
    }
  }
  return tempObject;
}
//switch heat on if tempObject heat is true
function kyteSisse () {
  var tempObj = tempObject();
  for(var prop in tempObj) {
    switch(prop) {
      case 'Kyte_garaaz':
        if(tempObj[prop]) {
          garaaziKyte.writeSync(0);
         // console.log('GARAAZ KYTAB');
        } else {
          garaaziKyte.writeSync(1);
          //console.log('GARAAZ EI' + prop+'  ' + tempObj[prop]);
        }
        break;
        case 'Kyte_eesruum':
        if(tempObj[prop]) {
          eesruumiKyte.writeSync(0);
          //console.log('EESRUUM KYTAB');
        } else {
          eesruumiKyte.writeSync(1);
          //console.log('EESRUUM EI');
        }
        break;
    }

  }
  return;
}

//Records heat start and end times to global roomTempState
function recordHeatStartEnd (TempObject) {
  //console.log(TempObject, roomTempState);
  if(Object.keys(TempObject).length !== 0) {
    //console.log(roomTemp);
    if(config.NODE_ENV === 'debug' && roomTempState.TestState !== TempObject['28-000007d4684f'].heat) {
      if(roomTempState.TestState) {

        roomTemp['28-000007d4684f'].TestHeatEnd = new Date().getTime();
        const period = roomTemp['28-000007d4684f'].TestHeatEnd - roomTemp['28-000007d4684f'].TestHeatStart;
        if(period > 0) {
          const HeatObject = {
            Period: period, 
            Start: roomTemp['28-000007d4684f'].TestHeatStart,
            End: roomTemp['28-000007d4684f'].TestHeatEnd,
            Room: 'Test'
          }
          handlers.insertHeatPeriod(HeatObject);
          //console.log(parseInt(roomTemp['28-000007d4684f'].TestHeatStart));
        }
        //console.log('Küte välja ' + timeConversion(roomTempState.TestStateEndTime - roomTempState.TestStateStartTime));

      } else {
        //console.log('Küte sisse ' + TempObject['28-000007d4684f'].temp);
        roomTemp['28-000007d4684f'].TestHeatStart = new Date().getTime();
      }
      
      roomTempState.TestState = TempObject['28-000007d4684f'].heat;
      
      //Garage heat monitoring when heating switches
    } else if (config.NODE_ENV !== 'debug' && roomTempState.GaraazState !== TempObject['28-0517c3a351ff'].heat) {
      //Heat was on

      if(roomTempState.GaraazState) {
        if(roomTemp['28-0517c3a351ff'].HeatStart === 0) {
          roomTemp['28-0517c3a351ff'].HeatStart = new Date().getTime();
        }
        roomTemp['28-0517c3a351ff'].HeatEnd = new Date().getTime();
        const period = roomTemp['28-0517c3a351ff'].HeatEnd - roomTemp['28-0517c3a351ff'].HeatStart;
        if(period > 0) {
          const HeatObject = {
            Period: period, 
            Start: roomTemp['28-0517c3a351ff'].HeatStart,
            End: roomTemp['28-0517c3a351ff'].HeatEnd,
            Room: 'Garaaz'
          }
          handlers.insertHeatPeriod(HeatObject);
          //console.log(parseInt(roomTemp['28-000007d4684f'].TestHeatStart));
        }
        //console.log('Küte välja ' + timeConversion(roomTempState.TestStateEndTime - roomTempState.TestStateStartTime));
        //Heating was off
  
      } else {
        //console.log('Küte sisse ' + TempObject['28-000007d4684f'].temp);
        roomTemp['28-0517c3a351ff'].HeatStart = new Date().getTime();
      }
      
      roomTempState.GaraazState = TempObject['28-0517c3a351ff'].heat;
    
      //Eesruum heat monitoring when heating switches
    } else if (config.NODE_ENV !== 'debug' && roomTempState.EesruumState !== TempObject['28-0417c2a85dff'].heat) {
      //Heat was on
      if(roomTempState.EesruumState) {

        if(roomTemp['28-0417c2a85dff'].HeatStart === 0) {
          roomTemp['28-0417c2a85dff'].HeatStart = new Date().getTime();
        }
    
        roomTemp['28-0417c2a85dff'].HeatEnd = new Date().getTime();
        const period = roomTemp['28-0417c2a85dff'].HeatEnd - roomTemp['28-0417c2a85dff'].HeatStart;
        if(period > 0) {
          const HeatObject = {
            Period: period, 
            Start: roomTemp['28-0417c2a85dff'].HeatStart,
            End: roomTemp['28-0417c2a85dff'].HeatEnd,
            Room: 'Eesruum'
          }
          handlers.insertHeatPeriod(HeatObject);
          //console.log(parseInt(roomTemp['28-000007d4684f'].TestHeatStart));
        }
        //console.log('Küte välja ' + timeConversion(roomTempState.TestStateEndTime - roomTempState.TestStateStartTime));
        //Heating was off
      } else {
        //console.log('Küte sisse ' + TempObject['28-000007d4684f'].temp);
        roomTemp['28-0417c2a85dff'].HeatStart = new Date().getTime();
      }
          
      roomTempState.EesruumState = TempObject['28-0417c2a85dff'].heat;
          
    }  
  }
}



function timeConversion(millisec) {

  var seconds = (millisec / 1000).toFixed(1);

  var minutes = (millisec / (1000 * 60)).toFixed(1);

  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
      return seconds + " Sec";
  } else if (minutes < 60) {
      return minutes + " Min";
  } else if (hours < 24) {
      return hours + " Hrs";
  } else {
      return days + " Days"
  }
}

module.exports = {
  addSubscriber: addSubscriber,
  removeSubscriber: removeSubscriber,
  setMessageInterval: setMessageInterval,
  readAllTemp: readAllTemp,
  tempObject: tempObject
};