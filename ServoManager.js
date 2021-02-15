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
		if(this.strategy)this.strategy.stop();
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
			case 5:
				this.strategy = new PorPasosEnBucle(this)
				break
			default:
				this.strategy = new Bucle(this)
		}
	}
	actualizar(opts){
		const oldRange = this.fiveServo.range;
		console.log('oldRange: ', oldRange);
		console.log('opts: actualizar', opts);
		this.fiveServo.range=opts.range;
		if(this.strategy)this.strategy.reset();
		this.elegirEstrategia(opts.estrategia);
	}
	ejecutarInstruccion (parametros){
		this.strategy.muevase(parametros)
	}
	stop(){
		this.fiveServo.stop();
		this.strategy.stop();
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
	stop(){}
	reset(){}
}

class Bucle extends Strategy{
	constructor(motor) {
		super(motor)
		console.log('Bucle created')
	}

	muevase (parametros){
		this.servoDosis.fiveServo.sweep()
	}
}

class Ir extends Strategy{
	constructor(motor) {
		super(motor)
		console.log('Ir created')
	}

	muevase (parametros){
		console.log("parametros : Ir",parametros);
		// console.log("this : ",this);
		// console.log('Ir algorithm, this.fiveServo: ',this.fiveServo)
		/*
		 Move a servo horn to specified position in degrees, 0-180 (or whatever the current valid range is). If ms is specified, the servo will take that amount of time to move to the position. If rate is specified, the angle change will be split into distance/rate steps for the ms option. If the specified angle is the same as the current angle, no commands are sent.
		 */
		const targetAngle = parametros.final;
		const range = this.servoDosis.fiveServo.range;
		console.log('range: ', range);
		console.log('targetAngle: ', targetAngle);
		const time = parametros.tiempo * 1000;
		console.log('time: ', time);
		this.servoDosis.fiveServo.to(targetAngle,time);
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
class PorPasosEnBucle extends Strategy{
	constructor(motor) {
		super(motor)
		this.flag = true;
		this.bindedOnMoveComplete = this.onMoveComplete.bind(this)
		this.servoDosis.fiveServo.on("move:complete",this.bindedOnMoveComplete)
	}
	onMoveComplete(){
		this.flag=!this.flag;
		this.muevase();
	}

	muevase (parametros){
		if(parametros){
			this.parametros = parametros;
		}else{
			parametros = this.parametros;
		}
		if(this.flag){
			this.servoDosis.fiveServo.to(parametros.final,parametros.tiempo*1000, parametros.pasos);
		}else{
			this.servoDosis.fiveServo.to(parametros.start,parametros.tiempo*1000, parametros.pasos)
		}
	}
	stop(){
		this.servoDosis.fiveServo.removeListener("move:complete",this.bindedOnMoveComplete)

	}
	reset(){
		this.stop()
	}
}
class BucleConPausa extends Strategy{
	constructor(motor) {
		super(motor);
		this.animation = new five.Animation(this.servoDosis.fiveServo);
		this.setTimeoutId=0;
	}

	muevase (parametros){
		console.log("parametros : ",parametros);
			this.animation.enqueue({
				duration: parametros.tiempoMov*1000,
				cuePoints: [0, 0.3, 0.6, 1.0],
				keyFrames: [ {degrees: parametros.start}, {degrees: parametros.final},{degrees: parametros.start}, {degrees: parametros.final}],
				oncomplete:()=>{
					if(this.setTimeoutId===-1)return
					this.setTimeoutId = setTimeout(()=>{
						if(this.setTimeoutId===-1)return
						this.muevase(parametros)
					},parametros.tiempoPausa*1000);
				}
			});
	}
	stop(){
		clearTimeout(this.setTimeoutId);
		this.setTimeoutId=-1;
		this.animation.stop();
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