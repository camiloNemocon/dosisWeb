const EventEmitter = require("events");
const osc = require('osc-min');

class AppOSCListener extends EventEmitter{
    constructor(){
        super();
    }
    onOSCRecieved(msg){
        let rawMessage = osc.fromBuffer(msg);
        this.processMessage(rawMessage)
    
    }
    processMessage(msg){
        console.warn('Must override')

    }
}
AppOSCListener.oscReceivedEvent = "osc-received";
module.exports = AppOSCListener;