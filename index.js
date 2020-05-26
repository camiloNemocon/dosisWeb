const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var five = require('johnny-five');

var led;

//cronometro del interval
var loopID;
//intervalo de tiempo
let intervalo = 1000;


let contadorIndice=0;


var pines_global;
var pines = [];

app.use(express.static(__dirname))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var board = new five.Board({
    repl:false
    });

io.on('connection', function(socket)
{
  socket.on('chat message', function(msg)
  {
    io.emit('chat message', msg);
    console.log("msg: ",msg);

       eval(msg);

      });
});

board.on('ready', function () 
{
 for (let i = 0; i < 13; i++)
 {
    var pin = new five.Pin({ pin: i,mode: 1});
    pines.push(pin);
    pin.low();
  }
  console.log("start!!!");
    
});

function prender(...pinesID) {
    console.log("pines : ",pinesID);

    for (let i = 0; i < pinesID.length; i++)
    {
        console.log(i);
        pines[pinesID[i]].high();
    }
}

function apagar(...pinesID) 
{
    console.log("pines : ",pinesID);

    for (let i = 0; i < pinesID.length; i++)
    {
        console.log(i);
        pines[pinesID[i]].low();
    }
}

function cambiarIntervalo(argument) 
{
    intervalo = argument;
    clearInterval(loopID);
    loopArduino();
}

function loopArduino(...pinesID) 
{
    console.log("pines : ",pinesID);

//[2,4,7,8]
    if(pinesID.length !== 0 )
    {
         pines_global = pinesID;
    }
    else
    {
        pinesID = pines_global;
    }
    

    loopID=setInterval(()=>
    {
         pines[pinesID[contadorIndice]].high();

        if(contadorIndice > 0)
        {
            pines[pinesID[contadorIndice-1]].low();
        }
        else
        {
            pines[pinesID[pinesID.length-1]].low();   
        }

        contadorIndice++;

        if(contadorIndice >= pinesID.length)
        {
            contadorIndice=0;            
        }
    
    },intervalo)
}

function onceArduino(...pinesID) 
{
    console.log("pines : ",pinesID);

    pines_global = pinesID;
    

    loopID=setInterval(()=>
    {
         pines[pinesID[contadorIndice]].high();

        if(contadorIndice > 0)
        {
            pines[pinesID[contadorIndice-1]].low();
        }

        contadorIndice++;

        if(contadorIndice >= pinesID.length)
        {
            clearInterval(loopID)   
        }

    },intervalo)
}

function detenerLoop()
{
    clearInterval(loopID);
}





http.listen(port, function()
{
  console.log('listening on *:' + port);
});


