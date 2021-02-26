const pinsManager = require('./PinsManager');
// var  = new PinsManager();
let intervalo = 1000;
let contadorIndice = 0;
let pines_global = [];
let loopID;
let loopIds = [];
function onceArduino(...pinesID) {
    checkPins(pinesID, 'loopArduino');
    let pines = pinsManager.j5Pins
    loopID = setInterval(()=>{doLoopPins(pinesID,true)}, intervalo);
    loopIds.push(loopID);
}
function loopArduino(...pinesID) {
    checkPins(pinesID, 'loopArduino');
    let pines = pinsManager.j5Pins
    if (pinesID.length !== 0) {
        pines_global = pinesID;
    }
    else {
        pinesID = pines_global;
    }


    loopID = setInterval(()=>{doLoopPins(pinesID)}, intervalo)
    loopIds.push(loopID);
}
function doLoopPins(pinesID,isOnce=false) {

    console.log('-------------------------------')
    let currentId = pinesID[contadorIndice];
    let previousId;
    let lastId = pinesID[pinesID.length - 1];
    pinsManager.getPinById(currentId).high();
    // pines[].high();

    if (contadorIndice > 0) {
        previousId = pinesID[contadorIndice - 1];
        pinsManager.getPinById(previousId).low();
        // pines[previousId].low();
    }
    else {
        pinsManager.getPinById(lastId).low();
        // pines[lastId].low();   
    }

    contadorIndice++;

    if (contadorIndice >= pinesID.length) {
        contadorIndice = 0;
        if(isOnce)clearInterval(loopID);
    }


}
function prender(...pinesID) {
    checkPins(pinesID, 'prender');
    console.log("pines : ", pinesID);

    for (let i = 0; i < pinesID.length; i++) {
        console.log(i);
        pinsManager.getPinById(pinesID[i]).high();
        // pines[pinesID[i]].high();
    }
}
function apagar(...pinesID) {
    checkPins(pinesID, 'prender');
    console.log("pines : ", pinesID);

    for (let i = 0; i < pinesID.length; i++) {
        console.log(i);
        pinsManager.getPinById(pinesID[i]).low();
    }
}
/**
 * 
 * @param  {...any} pinesData a list of {pin,start,lapse} objects
 */
var pinesSameTime;
function sameTime(...pinesData) {
    apagarPinesSameTime();
    //console.log("PinesData : ",PinesData);
    var pinesIds = pinesData.map(pinDatum => pinDatum.pin);
    let fivePins = checkPins(pinesIds, 'sameTime');
    // return;
    pinesSameTime = pinesData;
    for (var i = 0; i < pinesData.length; i++) {
        let pinId = pinesData[i].pin;
        pinesData[i].id = i;
        pinesData[i].fivePin = pinsManager.getPinById(pinId);
        pinesData[i].ciclo = function () {
            this.init_id = setTimeout(() => {
                console.log('start', this.pin);
                this.fivePin.high();
                this.stop_id = setTimeout(() => {
                    console.log('stop', this.pin);
                    this.fivePin.low();
                    pinesSameTime[this.id].ciclo();
                },
                    this.lapse * 1000)
            }, this.start * 1000)
        }
        pinesData[i].ciclo();

    }

}
function checkPins(pinesIds, sender) {
    console.log("[checkPins] pinesIds :", pinesIds)
    const output = pinsManager.check(pinesIds);
    if (!output) {
        console.log("[checkPins] emit a message to the user");
        return;
    }
    return output;
}
function apagarTodo() {
    const pins = pinsManager.pins;
    console.log('apagarTodo : ', pins);
    pinsManager.stopAll();
    clearInterval(loopID)
    loopID = null;
    loopIds.forEach(x=>{
        clearInterval(x)

    })
    // apagarServos();
    apagarPinesSameTime();
}
function apagarPinesSameTime() {
    if (pinesSameTime) {
        pinesSameTime.forEach(function (pin_object) {
            clearTimeout(pin_object.init_id)
            clearTimeout(pin_object.stop_id)
        })
        pinesSameTime.length = 0;
    }
}
function cambiarIntervalo(argument) {
    intervalo = argument;
    clearInterval(loopID);
    loopArduino();
}
function detenerLoop(){
    clearInterval(loopID);
}
module.exports.loopArduino = loopArduino;
module.exports.cambiarIntervalo = cambiarIntervalo;
module.exports.prender = prender;
module.exports.sameTime = sameTime;
module.exports.apagarTodo = apagarTodo;
module.exports.onceArduino = onceArduino;
module.exports.apagar = apagar;
module.exports.prender = prender;
module.exports.detenerLoop = detenerLoop;
