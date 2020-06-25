var five = require('johnny-five');
var Servo = five.Servo;
class ServoManager  {
// class DosisServoMotor {
    constructor(opts){
    	console.log("opts : ",opts);
        this.fiveServo = new Servo(opts)
        // console.log('servo en pin no. :', pin)
        // thispinValue = opts.pin ;
        // this.range = opts.range

    }
    elegirEstrategia(type){
    	console.log("type : ",type);
        switch(type) {
            case 0:
                this.strategy = new Bucle(this)
                break
            case 1:
                this.strategy = new Ir(this)
                break
            case 2:
                this.strategy = new IrRapido(this)
                break
            case 3:
                this.strategy = new PorPasos(this)
                break
            case 4:
                this.strategy = new BucleConPausa(this)
                break
            default:
                this.strategy = new Bucle(this)
        }
    }
    actualizar(opts){
    	this.elegirEstrategia(opts.estrategia);
    	this.fiveServo.range=opts.range;
    }
    ejecutarInstruccion (parametros){
        this.strategy.muevase(parametros)
    }
    stop(){
        this.fiveServo.stop();
    }
}
/*
class DosisLed {
    constructor(pin){
        this.fiveServo = new FiveLed(pin)
        console.log('fiveServo en pin no. :', pin)
    }
    elegirEstrategia(type){
        switch(type) {
            case 0:
                this.strategy = new Bucle(this)
                break
            case 1:
                this.strategy = new Ir(this)
                break
            default:
                this.strategy = new Bucle(this)
        }
    }

    ejecutarInstruccion (parametros){
        this.strategy.muevase(parametros)
    }
}
*/
class Strategy {
    constructor(motor) {
        this.servoDosis=motor;
    }
    //AlgorithmInterface
    muevase (parametros){
        console.log('muevase usando five.animation api');
    }
}

class Bucle extends Strategy{
    constructor(motor) {
        super(motor)
        console.log('Bucle created')
    }

    muevase (parametros){
        // console.log('Bucle algorithm',this.servoDosis.fiveServo)
        // let animation = new Animation(this.servoDosis.fiveServo);
        // animation.enqueue(parametros)
        this.servoDosis.fiveServo.sweep()
    }
}

class Ir extends Strategy{
    constructor(motor) {
        super(motor)
        console.log('Ir created')
    }

    muevase (parametros){
    	// console.log("parametros : ",parametros);
        // console.log("this : ",this);
        // console.log('Ir algorithm, this.fiveServo: ',this.fiveServo)
        /*
         Move a servo horn to specified position in degrees, 0-180 (or whatever the current valid range is). If ms is specified, the servo will take that amount of time to move to the position. If rate is specified, the angle change will be split into distance/rate steps for the ms option. If the specified angle is the same as the current angle, no commands are sent.
         */
        this.servoDosis.fiveServo.to(parametros.final,parametros.tiempo*1000)
    }
}
class IrRapido extends Strategy{
    constructor(motor) {
        super(motor)
    }

    muevase (parametros){
        this.servoDosis.fiveServo.to(parametros.final)
    }
}

class PorPasos extends Strategy{
    constructor(motor) {
        super(motor)
    }

    muevase (parametros){
        this.servoDosis.fiveServo.to(parametros.final,parametros.tiempo*1000, parametros.pasos)
    }
}
class BucleConPausa extends Strategy{
    constructor(motor) {
        super(motor)
    }

	muevase (parametros){
		var animation = new five.Animation(servo);

		// Create an animation segment object
		animation.enqueue({
			duration: 2000,
			cuePoints: [0, 1.0],
			keyFrames: [ {degrees: parametros.start}, {degrees: parametros.final}],
			oncomplete:()=>{
				this
				console.log("this : ",this);
				let tiempo = parametros.tiempo;
				console.log("tiempo : ",tiempo);
			},
			onstart:function(){
				this
				console.log("this : ",this);
			},
		});
	}
}

function init_Strategy() {
    //Contexttt
    console.log('usuario envia primera orden xxxxxxxxxxxxxxxxxxxxx');
    let servoMotor = new DosisServoMotor(9)
    //nuevo: cuando llega el comando del usuario.
    servoMotor.elegirEstrategia("A")
    let configBucle = {
        duration: 2000,
        cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
        keyFrames: [ {degrees: 0}, {degrees: 135}, {degrees: 45}, {degrees: 180}, {degrees: 0}]
    }
    //en otro momento por definir
    servoMotor.ejecutarInstruccion(configBucle);
    //nuevo: cuando llega el comando del usuario.
    console.log('usuario envia otra orden +++++++++++++++++++++++++++');
    servoMotor.elegirEstrategia("B");
    servoMotor.ejecutarInstruccion();

    // let contextB = new DosisServoMotor("B")
    // contextB.ejecutarInstruccion()
}
// init_Strategy()
module.exports = ServoManager;