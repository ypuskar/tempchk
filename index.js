app=require("./app");
const PORT =  process.env.PORT || 4000;
app.startServer(PORT,5000);
/*const http = require('http');
const PORT = process.env.PORT || 8000;
console.log('Starting timestamp-service. '+ PORT );
//console.log(process.env);

http.createServer((request, response) => {
  const timeStamp = Math.floor(Date.now() / 1000)
  
  console.log(`Received request at ${timeStamp}.`)
  
  response.write(`${timeStamp}`)
  response.end()
}).listen(PORT)*/