var five = require('johnny-five');
var Stepper = five.Stepper;
/*
new five.Stepper({
  type: five.Stepper.TYPE.DRIVER,
  stepsPerRev: 200,
  pins: [ 11, 12 ]
});
 */
class StepperManager  {
  constructor(args) {
    console.log("args :----------> ",args);
    let tipos_posibles=[
    five.Stepper.TYPE.DRIVER, 
    five.Stepper.TYPE.TWO_WIRE, 
    five.Stepper.TYPE.FOUR_WIRE]
    console.log("tipos_posibles : ",tipos_posibles);
    this.stepper = new Stepper({
      pins:args.pines,
      stepsPerRev: 200,
      type:4
    })
  }
  stop(){
    console.log('STOP!');
  }
  actualizar(p){
    console.log("p : ",p);

  }
  ejecutarInstruccion(parametros){
    console.log("parametros : ",parametros);
    console.log("-----------------");
  }

  // methods
}
module.exports = StepperManager;