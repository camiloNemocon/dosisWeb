var five = require('johnny-five');
var Stepper = five.Stepper;
class StepperManger  {
	constructor(args){
		console.log("args : ",args);
		//{pines:[2,3,4,5],sentido:derecha,rpm:180,estado:0,circuito:L293D}
		//circuito: L293D, easydriver, a4988, uln2003
		//motor: 28byj-48, nema17
		let type=-1;
		let stepsPerRev=-1;
		if(args.circuito==='easydriver'){
			type=1;
		}else if(args.circuito==='l293d'||args.circuito==='a4988'||args.circuito==='uln2003'){
			type=4;
		}
		if(args.motor==='nema17'){
			stepsPerRev=200;
			// stepsPerRev=400;
			// stepsPerRev=1048;
			this.rpm = 180;
		}else if(args.motor==='byj48'){
			stepsPerRev=2048;
			this.rpm = 15;
		}
		
		if(type===-1){
			throw new Error("No se eligió bien el circuito")
		}
		if(stepsPerRev===-1){
			throw new Error("No se eligió bien el motor")
		}
		
		this.fiveStepper = new Stepper({
			id:'stepper-dosis',
	      pins:args.pines,
	      stepsPerRev,
	      type
	    })
		
   
		// console.log('servo en pin no. :', pin)
		// thispinValue = args.pin ;
		// this.range = args.range

	}
	elegirEstrategia(type){
		console.log("type -: ",type);
		if(this.strategy)this.strategy.stop();
		switch(type) {
			case 0:
				this.strategy = new Bucle(this)
				break
			case 1:
				this.strategy = new VayaYVenga(this)
				break
			default:
				this.strategy = new Bucle(this)
		}
	}
	actualizar(opts){
		console.log("opts :>>>>>>>>>>>>>> ",opts);
		console.log('actualizar');
		let dir =-1;
		if(opts.sentido==='horario'){
			dir = 1;
		}else if(opts.sentido==='anti'){
			dir = 0;
		}
		console.log("dir : __________",dir);
		// 180r/m 1m/60s = 3r/s v=d/t = t=d/v
		this.fiveStepper
			.rpm(opts.rpm)
			.direction(dir)
			.accel(0)
			.decel(0);
		if(this.strategy)this.strategy.reset();
		this.elegirEstrategia(opts.estado);
		return
		// this.fiveStepper.range=opts.range;
	}
	ejecutarInstruccion (parametros){
		this.strategy.muevase(parametros)
	}
	stop(){
		// this.fiveStepper.stop();
		this.strategy.stop();
	}
}
class Strategy {
	constructor(motor) {
		this.stepperDosis=motor;
	}
	//AlgorithmInterface
	muevase (parametros){
		console.log('muevase usando five.animation api');
	}
	stop(){	}
	reset(){}
}

class Bucle extends Strategy{
	constructor(motor) {
		super(motor)
		console.log('Bucle created')
	}

	muevase (parametros){
		let limite = parametros.tiempo*1000;
		// console.log("parametros *******: ",parametros);
		// console.log("limite : ",limite);
		let starTime = new Date().getTime()
		// console.log("starTime : ",starTime);
		// return
		/*
		let interval_id = setInterval( ()=> {
			this.stepperDosis.fiveStepper.step(5, () => {})
			let lapso = new Date().getTime()-starTime
			console.log("lapso : ",lapso);
			if(lapso>limite){
				clearInterval(interval_id);
			}
		}, 60)
		*/
		// return;
		let steps;
		steps = parametros.tiempo*(180/60)*200;
		steps = 200;
		steps = parametros.pasos;
		console.log("steps : ",steps);
		let rpm = this.stepperDosis.fiveStepper.rpm();
		console.log("rpm : ",rpm);
		// this.stepperDosis.fiveStepper.sweep()
		this.stepperDosis.fiveStepper.step(steps, () => {
			console.log("parametros : ",parametros);
			console.log('++++++++++++++++++++++++');
			console.log("done moving CCW");
		});
	}
}
class VayaYVenga extends Strategy{
	constructor(motor) {
		super(motor)
		this.isMoving = true;
		console.log('VayaYVenga created')
	}

	muevase (parametros){
		let limite = parametros.tiempo*1000;
		let starTime = new Date().getTime()
		let steps;
		steps = parametros.pasos;
		if(!this.isMoving)return;
		this.stepperDosis.fiveStepper.step(steps, () => {
			let current_direction = this.stepperDosis.fiveStepper.direction();
			let new_direction = -1;
			if(current_direction===0){
				new_direction=1
			}else {
				new_direction=0

			}
			if(!this.isMoving)return;
			this.stepperDosis.fiveStepper.step({
				steps: steps,
				direction: new_direction
			}, () => {
				this.muevase(parametros)
			} );
		});
	}
	stop(){
		this.isMoving = false;
	}
}



module.exports = StepperManger;