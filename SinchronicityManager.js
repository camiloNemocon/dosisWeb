const EventEmitter = require("events");
const AppOSCListener = require('./osc/osc-listeners/AppOSCListener');
const TidalListener = require("./osc/osc-listeners/tidal-listener");
class SinchronicityManager extends EventEmitter{
    constructor(p,oscListener) {
        super();
        this.userParams = p;
        switch (p.tipo) {
            case 'tidal':
                this.strategy = new TidalSynchronicity(this,oscListener);
                break;
            case 1:
                this.strategy = new SuperColliderSynchronicity(this);
                break;
        }
    }
}
SinchronicityManager.gateUpEvent = 'gateUp-event';
SinchronicityManager.gateDownEvent = 'gateDown-event';
class Strategy {
    constructor(syncronization,oscListener) {
        this.syncronization = syncronization;
        this.oscListener = oscListener;
        this.sound;
        this.userParams;
    }
    oscListener(){}
    stop(){}
    update(){}
}
class TidalSynchronicity extends Strategy {
    constructor(synchronization,oscListener) {
        super(synchronization,oscListener)
        this.synchronization =  synchronization;
        console.log('synchronization: ', synchronization);
        const sound = synchronization.userParams.s;
        this.userParams = synchronization.userParams;
        console.log('sound: ', sound);
        this.soundName = sound;
        this.play();
    }
    play(){
        this.oscListener.on(AppOSCListener.oscReceivedEvent, this.onOscReceived.bind(this))

    }
    onOscReceived(oscParams){
        console.log('oscParams: ----', oscParams);
        const userParams = this.userParams;
        console.log('userParams: ', userParams);
        const tidalCondition = oscParams.s === userParams.s;
        if(tidalCondition){
            this.syncronization.emit(SinchronicityManager.gateUpEvent,userParams.pin);
            setTimeout(()=>{
                this.syncronization.emit(SinchronicityManager.gateDownEvent,userParams.pin);
                
            },userParams.gate)
        }

    }
    stop(){
        this.oscListener.removeListener(AppOSCListener.oscReceivedEvent, this.onOscReceived.bind(this))

    }
    update(userParams){
        this.stop();
        this.userParams=userParams;
    }
}
class SuperColliderSynchronicity extends Strategy {
    constructor(synchronization) {
        super(synchronization)
    }
}
module.exports = SinchronicityManager;