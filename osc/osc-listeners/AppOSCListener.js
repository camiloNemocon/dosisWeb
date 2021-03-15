const EventEmitter = require("events");

class AppOSCListener extends EventEmitter{
    constructor(){
        super();
    }
    onOSCRecieved(msg){
        let rawMessage = osc.fromBuffer(msg);
        console.log('rawMessage: ', rawMessage);
    
    }
}
AppOSCListener.oscReceivedEvent = "osc-received";
module.exports = AppOSCListener;