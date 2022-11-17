console.clear();
let fs = require('fs');
var stackTrace = require('stack-trace');
const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
let ServoManager = require('./ServoManager')
let StepperManager = require('./StepperManager')
let MessageManager = require('./MessageManager')

// new ServoManager()|||
let messageManager = new MessageManager();
messageManager.on('parsed',function(msg,name,thing){
    // arguments
    // console.log("arguments : ",arguments);
    // console.log("thing : ",thing);
        try{
            io.emit('chat message', msg);
            eval(msg)
            // console.log("msg : parsed",msg);
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
// const TidalListener = require("./osc/osc-listeners/tidal-listener");
const SinchronicityManager = require('./SinchronicityManager');
const TidalOSCListener = require('./osc/osc-listeners/TidalOSCListener');
const SuperColliderOSCListener = require('./osc/osc-listeners/SuperColliderOSCListener');
const { triggerAttackEvent } = require('./SinchronicityManager');
// const tidalListener = new TidalListener();
//cronometro del interval
var loopID;
//intervalo de tiempo
let intervalo = 1000;
let process_arg = process.argv;
console.log("process_arg" , process_arg);
let portFromArguments=-1;
if(process_arg[2]){
  portFromArguments = process_arg[2];
}
console.log('com: ', portFromArguments);

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
const repl=false;
const nonComConfig = {repl}
const comConfig = {  
  port: portFromArguments,
  repl
};
let boardConfig = portFromArguments===-1?nonComConfig:comConfig;
console.log('boardConfig: ', boardConfig);
if(!is_testing)
var board = new five.Board(boardConfig);

io.on('connection', function(socket)
{
  socket.on('chat message', function(msg)
  {
    // console.clear();
    console.log("===========================================================");
    console.log("msg: ",msg);
    let is_parsing;
    is_parsing = false;
    is_parsing = true;
    if(is_parsing){

      messageManager.parse(msg);
      console.log("msg 4 eval : ",msg);
      
    }else{


      try
      {
          io.emit('chat message', msg);
          eval(msg);
          // eval(`console.log(${msg})`);

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
    }
      
 });
});
/*
let servoMotor;
let servoContador=0;
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
var A="A"
var B="B"
var C="C"
var D="D"
var E="E"
var F="F"
var G="G"
*/
var pines_servos=[];
// userCommand = 'servo({pin:10,estado:A, start:0, final:90, tiempo:2})'
// eval(userCommand);
// userCommand = 'servo({pin:10,estado:A, start:0, final:180, tiempo:2})'
// eval(userCommand);
// servo({pin:10,estado:0, start:0, final:90, tiempo:2})
var servos={};
function servo(configuracion){
    console.log("configuracion : ",configuracion);
    let pin = configuracion.pin;
    let start = configuracion.start;
    let final = configuracion.final;
    let tiempo = configuracion.tiempo;
    let estrategia = configuracion.estado;
    console.log("estrategia : ",estrategia);
    console.log("pin : ",pin);
    let servoMotor = servos[pin]
    let range = [start, final]
    if(!servoMotor){
        pines_servos.push(pin)
        servoMotor = new ServoManager({
            pin,
            range,
            tiempo
        });
        servos[pin]=servoMotor
    }else{
      console.log('stopping servo')
        servoMotor.stop();
    }
    servoMotor.actualizar({estrategia,range});
    servoMotor.ejecutarInstruccion(configuracion);
}
function apagarServos() {
  var pin;
  for( pin in servos ) {
    var servo = servos[pin];
    servo.stop();
  }
}
if(!is_testing)
board.on('ready', function (){
 for (let i = 0; i < 13; i++)
 {
    var pin = new five.Pin({ pin: i,mode: 1});
    pines.push(pin);
    pin.low();
  }
  console.log("start!!!");
 // messageManager.parse("servo({pin:10,estado:5, start:10, final:170, tiempo:3, pasos:3})")
 // messageManager.parse("stepper({pines:[2,3,4,5],tiempo:5,estado:0,circuito:L293D,motor:nema17})")
 // messageManager.parse("stepper({pin:[6,7,8,9],sentido:izquierda,rpm:180})")
//  messageManager.parse("stepper({pines:[3,4],sentido:horario,rpm:180,vueltas:5,circuito:a4988,motor:nema17,estado:0,pinParar:2,id:1})")

  //tidal
  messageManager.parse("sincronizarPin({s:bd,tipo:tidal,pin:4,gate:200})")

  //supercolllider
  // messageManager.parse("sincronizarPin({instrument:bd,tipo:sc,pin:4,gate:100})")
  // messageManager.parse("sincronizarPin({instrument:hh,tipo:sc,pin:2,gate:100,servo:sierra})")
  // messageManager.parse("sincronizarPin({instrument:bd,tipo:sc,pin:2,tiempo:100, sinc:puerta})")
  // messageManager.parse("sincronizarPin({instrument:bz,tipo:sc,pin:3,angulo:10, sinc:servo1})")
  // messageManager.parse("sincronizarPin({instrument:hh,tipo:sc,pin:8,tiempo:100, sinc:puerta})")
  // messageManager.parse("sincronizarPin({instrument:hh,escuchando:[degree,dur,detune],tipo:sc,pin:13,gate:200})")
  // messageManager.parse("sincronizarPin({instrument:bd,escuchando:[degree,dur,detune],tipo:sc,pin:5,gate:200})")
  /*setTimeout(function(){
    console.log("deteniendo servos");
    messageManager.parse("detenerSincroServos()")
    setTimeout(function(){
      console.log("deteniendo steppers");
      messageManager.parse("sincronizarPin({instrument:bz,tipo:sc,pin:3,angulo:10, sinc:servo1})")
    },1000)
  },3000)
  */
});
var derecha = "derecha";
var izquierda = "izquierda";
var L293D = "l293d";
var l293d = "l293d";
var L293d = "l293d";
var l293D = "l293d";
var a4988 = "a4988";
var A4988 = "a4988";
var byj48 = "byj48";
var uln2003 = "uln2003";
var easydriver = "easydriver";
var Easydriver = "easydriver";
var easyDriver = "easydriver";
var nema17 = "nema17";
var horario = "horario";
var anti = "anti";
var stepperMotor;
var sm;
function stepper(configuracion){
    console.log("configuracion 1 : ",configuracion);
    /*
    let pin = configuracion.pin;
    let start = configuracion.start;
    let final = configuracion.final;
    let tiempo = configuracion.tiempo;
    let estrategia = configuracion.estado;
    console.log("estrategia : ",estrategia);
    console.log("pin : ",pin);
    // let stepperMotor = ste[pin]
    let range = [start, final]
    */
    if(!stepperMotor){
        // pines_servos.push(pin)
        stepperMotor = new StepperManager(configuracion);
        sm = stepperMotor.fiveStepper;
        // console.log("sm : ",sm);
        // servos[pin]=servoMotor
    }else{
        stepperMotor.stop();
    }
    stepperMotor.actualizar(configuracion);
    stepperMotor.ejecutarInstruccion(configuracion);
}
function detenerPAP() {
  if(stepperMotor){
    stepperMotor.stop();
  }
}
function prender(...pinesID) {
    // console.log("pines : ",pinesID);

    for (let i = 0; i < pinesID.length; i++)
    {
        // console.log(i);
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
    apagarServos();
}

function apagar(...pinesID) 
{
    // console.log("pines : ",pinesID);

    for (let i = 0; i < pinesID.length; i++)
    {
        // console.log(i);
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
  console.log('listening on localhost:' + port);
});
process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
  io.emit('server crashed', "The server crashed!!!!!!!!!!!!!--El servidor se jodió");
  process.exit(1) //mandatory (as per the Node.js docs)
})
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
let syncingThang;
/**
 * object of SinchronicityManger instances, each item is 
 * a Synchronicity strategy according to the software 
 * it is listening to, which in turn has the corresponding osc
 * listner (listens to each osc event)
 */
let sinchronicityMangerArray = {};
let tidalOSCListener;
let scOSCListener;
// sincronizarPin({s:bd,tipo:tidal,pin:4,gate:100})
// sincronizarPin({instrument:bd,tipo:supercollider,pin:5,gate:100})
function sincronizarPin(userParams) {
  console.log('userParams: __________', userParams);
  if(!userParams.pin){
    io.emit("Se le olvido el pin, gente!")
    return;
  }
  /** @type {!SinchronicityManager}*/
  let syncManager = sinchronicityMangerArray[userParams.pin];
  if(syncManager){
    console.log('ya esta sincronizado');
    syncManager.update(userParams);

  }else{
    let listenerType
    if(userParams.tipo === "tidal"){
      if(!tidalOSCListener){// crude Singleton
        tidalOSCListener = new TidalOSCListener()
      }
      listenerType = tidalOSCListener;
      
    }else if(userParams.tipo === 'sc'){
      if(!scOSCListener){// crude Singleton
        scOSCListener = new SuperColliderOSCListener()
      }
      listenerType = scOSCListener;
    }
    // return
    // const servo = sinchronicityMangerArray[userParams.pin];
    // if(servo.custom.isOn){
    syncManager = new SinchronicityManager(userParams,listenerType);
    // synchStrategy = syncManager.strategy;
    syncManager.on(SinchronicityManager.gateUpEvent,onGateUp)
    syncManager.on(SinchronicityManager.triggerAttackEvent,ontriggerAttack)
    // console.log('SinchronicityManager.triggerAttackEvent: ', SinchronicityManager.triggerAttackEvent);
    // syncManager.on(SinchronicityManager.gateUpEvent,prender)
    // syncManager.on(SinchronicityManager.gateUpEvent,apagar)
    sinchronicityMangerArray[userParams.pin]= syncManager;
  }
  // tidalListener.off(TidalListener.oscReceivedEvent, oscListener)
  // tidalListener.on(TidalListener.oscReceivedEvent, oscListener)
}
/**
 * 
 * @param {*} pin 
 * @param {*} time 
 */
function onGateUp(pin,time){
  // console.log('prendiendo pin',pin);
  prender(pin);
  setTimeout(apagar,time,pin);
}
const j5ServoMotors = {};
let servoPosition = 90;
let servoFactor = 1;
function ontriggerAttack(pin,angulo){
  // this
  // console.log('this: ', this);
  if(!j5ServoMotors[pin]){
    j5ServoMotors[pin] = new Servo({pin,startAt:90});
    j5ServoMotors[pin].servoFactor = 1;
    j5ServoMotors[pin].custom.isOn = true;
  }
  /**@type{!Servo} */
  const servo = j5ServoMotors[pin];
  // j5ServoMotors[pin].to(servoPosition);
  let p = servo.position;
  // console.log('servoPosition: ', servoPosition);
  servo.to(p + servo.servoFactor * angulo);
  servoPosition+= servo.servoFactor * angulo;
  if(servo.position>=170||servo.position<=10){
    servo.servoFactor *= -1
  }
/**
if(triggerAttackEventCounter>=170||triggerAttackEventCounter<=10){
  servoDelta *= -1
}

        servoMotor = new ServoManager({
            pin,
            range,
            tiempo
        });

    servoMotor.actualizar({estrategia,range});
    servoMotor.ejecutarInstruccion(configuracion);

   */

}

function detenerSincro(...pinesDetener){
  pinesDetener.forEach(pin => {
    console.log('pin: ', pin);
    if(sinchronicityMangerArray[pin]){
      sinchronicityMangerArray[pin].removeListener(SinchronicityManager.gateUpEvent,onGateUp);
      sinchronicityMangerArray[pin].removeListener(SinchronicityManager.triggerAttackEvent,ontriggerAttack);
      sinchronicityMangerArray[pin] = null;
      const _pin = pines[pin];
      _pin.low();
    }
    
  });
}

function detenerSincroServos(){
  Object.keys(j5ServoMotors).forEach(pin => {
    console.log('pin: ', pin);
    // j5ServoMotors[pin].to(90);
    if(!sinchronicityMangerArray[pin]||!sinchronicityMangerArray[pin].removeListener)return;
    sinchronicityMangerArray[pin].removeListener(SinchronicityManager.triggerAttackEvent,ontriggerAttack);
    sinchronicityMangerArray[pin] = false;
    if(j5ServoMotors[pin]){
      j5ServoMotors[pin].stop();
      j5ServoMotors[pin].custom.isOn = false;
    }
  });
}