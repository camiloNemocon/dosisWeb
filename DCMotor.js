//https://johnny-five.io/api/motor/
const {Motor}=require('johnny-five');
class DCMotor {
  constructor(args) {
    this.ids =[]
    this.motors = {}
  }
  add(motor) {}
  call(args){
    console.log('args: ', args);
    const {id,pins,forward,reverse}=args;
    console.log('reverse: ', reverse);
    console.log('forward: ', forward);
    console.log('id: ', id);
    console.log('pins: ', pins);
    const isAlreadyIncluded = this.ids.includes(id)
    if(!isAlreadyIncluded){
      this.ids.push(id)
      this.motors[id] = new Motor(pins)
    }
    const motor=this.motors[id]
    if(forward!==undefined){
      console.log('forward: ', forward);
      motor.forward(forward)
    }
    if(reverse!==undefined){
      motor.reverse(reverse)
    }
  // console.log("id: ", id);
  // console.log("motor.pins: ", pins);
  /**@type(Array)
   if (Array.isArray(pins)) {
     const isMotor = pins.every((x) => motorsPins.includes(x));
     console.log("isMotor: ", isMotor);
     const isTaken = pins.some((x) => motorsPins.includes(x));
     console.log("isTaken: ", isTaken);
    } else {
      console.log("`pins` is not an array");
    }
    * **/

  // console.log("pines.length: ", pines.length);
  // const motor = new Motor(pins);
  console.log("motor: ", Object.keys(motor));
  console.log("motor.pins: ", motor.pins);
  console.log("motor.opts: ", motor.settings);
  }
}
module.exports = DCMotor;
