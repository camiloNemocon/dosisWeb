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

    try
    {
         eval(msg);
    }
    catch (e)
    {
         io.emit('eval error', e);
        console.log("eval error: ",e); 
    }
      
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
    // sameTime({pin:1,start:3,lapse:4},{pin:2,start:1,lapse:2},{pin:3,start:2,lapse:2})
    sameTime({pin:1,start:0.5,lapse:1});
    
});

function prender(...pinesID) {
    console.log("pines : ",pinesID);

    for (let i = 0; i < pinesID.length; i++)
    {
        console.log(i);
        pines[pinesID[i]].high();
    }
}

function apagarTodo()
{
    for (let i = 0; i < 13; i++)
    {
        var pin = pines[i];
        pin.low();
    }
    if(pinesSameTime){
        pinesSameTime.forEach(function(pin_object){
            clearTimeout(pin_object.init_id)
            clearTimeout(pin_object.stop_id)
        })
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

//sameTime([1,3,4],[2,1,4],[2,4,5])
//sameTime({p:1,i:3,d:4},{p:2,i:1,d:2},{p:3,i:2,d:2})
//sameTime({pin:1,on:3,off:4},{pin:2,on:1,off:2},{pin:3,on:2,off:2})
//sameTime({pin:1,off:3,on:4},{pin:2,off:1,on:2},{pin:3,off:2,on:2})
// sameTime({pin:1,start:3,lapse:4},{pin:2,start:1,lapse:2},{pin:3,start:2,lapse:2})
// {pin:1,start:3,lapse:4,init_id:6234,stop_id:453647,id:ciclo:function(){}}
var pinesSameTime ;
function sameTime(...PinesData)
{
    //console.log("PinesData : ",PinesData);
    pinesSameTime=PinesData;
    for (var i = 0; i < PinesData.length; i++) 
    {
        PinesData[i].id = i;
        PinesData[i].ciclo = function(){
            this.init_id = setTimeout(() =>{
                console.log('start');
                // pines[this.pin].high();
                this.stop_id = setTimeout(() =>{
                    console.log('stop');
                    // pines[this.pin].low();
                    pinesSameTime[this.id].ciclo();
                },
                this.lapse*1000)
            },this.start*1000)
        }
        PinesData[i].ciclo();

    }
    
}







http.listen(port, function()
{
  console.log('listening on *:' + port);
});


