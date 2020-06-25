let fs = require('fs');
var stackTrace = require('stack-trace');
const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
let ServoManager = require('./ServoManager')
let MessageManager = require('./MessageManager')

// new ServoManager()
let messageManager = new MessageManager();
messageManager.on('parsed',function(msg,name,thing){
    // arguments
    console.log("arguments : ",arguments);
    // console.log("thing : ",thing);
        try{
            io.emit('chat message', msg);
            eval(msg)
            console.log("msg : ",msg);
        }catch(e){
            io.emit('eval error', e.toString());
            console.log("eval error: ",e); 
            var trace = stackTrace.parse(e);
            console.log("trace : ",trace);
            let error = {'eval error':e.toString(),trace}
            fs.writeFileSync('log.json',JSON.stringify(error,null,2),'utf8')
        }
})
// messageManager.parse("sameTime({pin:2,start:2,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:2,lapse:4})")
var five = require('johnny-five');
var Servo = five.Servo;
var led;
var ñ=7;
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
let is_testing;
is_testing = true;
is_testing = false;
if(!is_testing)
var board = new five.Board({
    repl:false
    });

io.on('connection', function(socket)
{
  socket.on('chat message', function(msg)
  {
    console.log("msg: ",msg);
    messageManager.parse(msg);
    return
    /*
    try
    {
        io.emit('chat message', msg);
        eval(msg);

    }
    catch (e)   
    {
        io.emit('eval error', e.toString());
        console.log("eval error: ",e); 
        var trace = stackTrace.parse(e);
        console.log("trace : ",trace);
        let error = {'eval error':e.toString(),trace}
        fs.writeFileSync('log.json',JSON.stringify(error,null,2),'utf8')
    }
      */
 });
});
let servoMotor;
let servoContador=0;
/*
function servo(config) {
  // console.log("config : ",config);
  let tiempo = config.tiempo*500;
  console.log("tiempo : ",tiempo);
  if(servoMotor){
    // console.log('A');
    servoMotor.stop();
  }
  // console.log('0');
  servoMotor = new Servo({
        pin:config.pin,
        range:[config.start,config.final],
        startAt:config.start
  })
  function get_position() {
            let p = servoMotor.position;
            console.log("p : ",p);
      // body...
  }
  if(config.estado===1){
        get_position();
        console.log('Estado 1');
        if(
            servoMotor.position===-1
            ||servoMotor.position===config.final){

              servoMotor.to(config.start,tiempo)      
          }else{

              servoMotor.to(config.final,tiempo)      
          }
            // if(servoContador%2){
              // servoMotor.to(config.start,tiempo)      
            // }else{
            // }
            // btn.addEventListener('click',function(){})
            
          servoMotor.on('move:complete',()=>{
                console.log('listo')
                get_position();
                servoContador++
                console.log("servoContador : ",servoContador);
                if(servoContador>config.veces){
                    servoContador=0;
                    return
                }
                // servoMotor.to()
                if(servoMotor.position===config.start){
                  servoMotor.to(config.final,tiempo) 
                  console.log('ìr hasta el fin');     
                }else{
                  servoMotor.to(config.start,tiempo) 
                  console.log('ir hasta el principio')     
                }
          })
  }else if(config.estado===0){
    console.log('Estado 0');

      let sweepConfig = {
        interval:tiempo
      }
      if(config.paso){
        sweepConfig.step = config.paso;
      }
      servoMotor.sweep(sweepConfig);
  }
}
*/
/*
servo({pin:10,estado:0, start:20, final:120, tiempo:2})
servo({pin:10,estado:bucle, start:20, final:120, tiempo:2})
servo({pin:10,estado:A, start:20, final:120, tiempo:2})
servo({pin:10,estado:"A", start:20, final:120, tiempo:2})

servo({pin:10,estado:0, start:0, final:180, paso:45,tiempo:10})

servo({pin:10,estado:0, start:0, final:180,tiempo:2})
servo({pin:10,estado:0, start:0, final:180,tiempo:4,paso:45})

servo({pin:10,estado:0, start:0, final:45, tiempo:1, paso:5})
servo({pin:10,estado:0, start:0, final:45})
servo({pin:10,estado:1, veces:5,start:0, final:150,tiempo:2})  
*/
var A="A"
var B="B"
var C="C"
var D="D"
var E="E"
var F="F"
var G="G"
var pines_servos=[];
userCommand = 'servo({pin:10,estado:A, start:0, final:90, tiempo:2})'
// eval(userCommand);
// userCommand = 'servo({pin:10,estado:A, start:0, final:180, tiempo:2})'
// eval(userCommand);
// servo({pin:10,estado:0, start:0, final:90, tiempo:2})
var servos=[];
function servo(...config){
    console.log("config : ",config);
    // console.log("desde la funcion servo : ",config[0])
    let configuracion = config[0]
    let pin = configuracion.pin;
    let start = configuracion.start;
    let final = configuracion.final;
    let tiempo = configuracion.tiempo;
    let pasos = configuracion.pasos;
    let estrategia = configuracion.estado;
    console.log("estrategia : ",estrategia);

    console.log("pin : ",pin);
    let isAlready = pines_servos.includes(pin)
    console.log("isAlready : ",isAlready);
    let range = [start, final]
    if(!isAlready){
        console.log('se crea el servo por primera vez');
        pines_servos.push(pin)
        servoMotor = new ServoManager({
            pin,
            range,
            tiempo
        });
        // return
        // servoMotor.elegirEstrategia(estrategia);
        servos.push(servoMotor)
    }else{
        servoMotor.stop();
    }
    servoMotor.actualizar({estrategia,range});
    servoMotor.ejecutarInstruccion({final,tiempo,pasos});
    console.log("pines_servos : ",pines_servos);

}
function apagarServos() {
  servos.forEach(servo=>servo.stop())
}
if(!is_testing)
board.on('ready', function () 
{
 for (let i = 0; i < 13; i++)
 {
    var pin = new five.Pin({ pin: i,mode: 1});
    pines.push(pin);
    pin.low();
  }
  console.log("start!!!");
  messageManager.parse("servo({pin:10,estado:3, start:10, final:170, tiempo:5, paso:5})")
  
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
                console.log('start',this.pin);
                 pines[this.pin].high();
                this.stop_id = setTimeout(() =>{
                   console.log('stop',this.pin);
                     pines[this.pin].low();
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

/*
// to do: add more examples
// to try this example, run the processing sketch in the folder processing.
// clicking on the sketch window sends the mouse x and y position to hydra via osc
// set port to listen to osc messages. default port is 57101
msg.setPort(51000)
// do something when a message is received at address '/test'
msg.on('/trowacv/ch/1', (args) => {
    // log osc results to console
    log(args)
})
// uses argument as variables in hydra
freq = 10
hue= 1
msg.on('/trowacv/ch/1', (args) => {
    freq = args[0]
    rot = args[1]/10
})
osc(20,0.1,() => freq/4)
.modulate(noise(()=>freq))
.modulate(o0,()=>hue/10)
.out()
*/
/*
window.onerror = function (msg, url, lineNo, columnNo, error) {
  var string = msg.toLowerCase();
  var substring = "script error";
  if (string.indexOf(substring) > -1){
    console.log('Script Error: See Browser Console for Detail');
    console.log('%cmsg ->'+msg,'background-color:green');
    setTimeout(do_restart,1000);
  } else {
    var message = [
      'Message: ' + msg,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + columnNo,
      'Error object: ' + JSON.stringify(error)
    ].join(' - ');

    console.log(message);
  }
 */
/*
process.on('uncaughtException', function (err) {
  console.log('pin pon papaps',err);
})
*/
