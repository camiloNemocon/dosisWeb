const udp = require('dgram');
const osc = require('osc-min');
const AppListener = require('./AppListener');

class SuperColliderOSCListener extends AppListener {
    constructor() {
        console.log('tidal listener constructed')
        super();
        // const udp = dgram.createSocket("udp4");
        const inport = 6666;
        const address = "localhost";
        const sock = udp.createSocket("udp4", msg => {
            var error, error1;
            try {
                this.onOSCRecieved()
                this.emit(TidalListener.oscReceivedEvent, data)
            } catch (error1) {
                error = error1;
                return console.log("invalid OSC packet");
            }
        });

        sock.bind(inport,address);
        console.log("tidal-listener executed?")
    }
}
module.exports = const { EventEmitter } = require('events');
;
