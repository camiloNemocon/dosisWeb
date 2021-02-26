const five = require('johnny-five');
class PinsManager {
    constructor(isDebugging=false) {
        this.pins = new Set();
        this.j5Pins = new Array();
        this.isDebugging = isDebugging;
    }
    check(...pins) {
        let output=[];
        console.log(pins);
        for (let index = 0; index < pins[0].length; index++) {
            const pin = pins[0][index];
            console.log('pin :', pin);
            if (!this.pins.has(pin)) {
                this.pins.add(pin);
                let pinObj;
                if(this.isDebugging){

                    pinObj = {
                        id: pin,
                        high: function(){
                            console.log(this.id, " high")
                        },
                        low:function () {
                            console.log(this.id, " low")
                            
                        }
                    };
                }else{
                    pinObj = new five.Pin({ pin ,mode: 1});
                }
                pinObj.low();
                this.j5Pins.push(pinObj);
                output.push(pinObj)

            }else{
                console.warn(`pin no. ${pin} has already been used`);
                // output =false;
                this.getPinById(pin);
                // break;
            }
        };
        console.log("pinsmanager pins set", this.pins);
        return output;
    }
    getPinById(id){
        let object;
        for (let index = 0; index < this.j5Pins.length; index++) {
            const pinObj = this.j5Pins[index];
            if(pinObj.pin===id){
                object = pinObj;
                break;
            }
        }
        if(!object){
            // throw new Error("didn't find a pin")
            console.log ("didn't find a pin")
        }
        return object;
    }
    stopAll(){
        this.j5Pins.forEach(pin=>{
            console.log("pin : ", pin);
            pin.low();
        })
    }
}
module.exports = new PinsManager();//exporting an instance makes it the only instance, i.e. a singleton