const { EventEmitter } = require('events');
const udp = require('dgram');
const osc = require('osc-min');
const AppListener = require('./AppOSCListener');

class TidalOSCListener extends AppListener {
    constructor() {
        console.log('tidal listener constructed')
        super();
        // const udp = dgram.createSocket("udp4");
        const inport = 6666;
        const address = "localhost";
        const sock = udp.createSocket("udp4", msg => {
            var error, error1;
            try {
                let msgObj = osc.fromBuffer(msg);
                // console.log(msgObj);
                let rawData = msgObj.elements[0].args;
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
                /*
                for (const key in data) {
                    if (Object.hasOwnProperty.call(data, key)) {
                        const element = data[key];
                        console.log(key, ': ', element);

                    }
                }
                */
                // console.log("emitting from tidal listener");
                this.emit(TidalListener.oscReceivedEvent, data)
                // console.log('this: ', this);
                // return console.log(rawData);
            } catch (error1) {
                error = error1;
                return console.log("invalid OSC packet");
            }
        });

        sock.bind(inport,address);
        console.log("tidal-listener executed?")
    }
}
module.exports = TidalOSCListener;
