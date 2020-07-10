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
  this.stepper.rpm(180).direction(Stepper.DIRECTION.CCW).accel(1600).decel(1600);

  }
  ejecutarInstruccion(parametros){
    console.log("parametros : ",parametros);
  this.stepper.step(2000, () => {
    console.log("done moving CCW");

    // once first movement is done, make 10 revolutions clockwise at previously
    //      defined speed, accel, and decel by passing an object into stepper.step
    this.stepper.step({
      steps: 2000,
      direction: Stepper.DIRECTION.CW
    }, () => console.log("done moving CW"));
  });
  }

  // methods
}
module.exports = StepperManager;