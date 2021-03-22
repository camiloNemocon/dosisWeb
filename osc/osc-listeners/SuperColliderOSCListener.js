const udp = require('dgram');
const osc = require('osc-min');
const AppOSCListener = require('./AppOSCListener');

class SuperColliderOSCListener extends AppOSCListener {
    constructor() {
        console.log('supercollider listener constructed')
        super();
        // const udp = dgram.createSocket("udp4");
        const inport = 3333;
        const address = "localhost";
        const sock = udp.createSocket("udp4", msg => {
            var error;
            try {
                this.onOSCRecieved(msg);
                this.emit(AppOSCListener.oscReceivedEvent, {a:1,b:'2'})
            } catch (error1) {
                console.log('error1: ', error1);
                error = error1;
                return console.log("invalid OSC packet - supercollider");
            }
        });

        
        sock.bind(inport,address);
        console.log("supercollider listener executed?")
    }
    processMessage(msg){
        const address = msg.address;
        // console.log('address: ', address);
        const rawData = msg.args;
        // console.log('rawData: ', rawData);
        const data = {};
        for (let index = 0; index < rawData.length; index += 2) {
            const evenElement = rawData[index];
            if (evenElement.type !== "string") {
                throw new Error("this should be a string");
            }
            const key = evenElement.value;
            const value = rawData[index + 1].value;
            // console.log('key: ', key);
            data[key] = value;
        }
        data.instrument = address;
        // console.log('data: ', data);
        this.emit(AppOSCListener.oscReceivedEvent, data)

    }
}
module.exports = SuperColliderOSCListener