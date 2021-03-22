const EventEmitter = require("events");
const AppOSCListener = require('./osc/osc-listeners/AppOSCListener');
/**
 * The strategy context
 */
class SinchronicityManager extends EventEmitter{
    constructor(p,oscListener) {
        super();
        this.userParams = p;
        switch (p.tipo) {
            case 'tidal':
                this.strategy = new TidalSynchronicity(this,oscListener);
                break;
            case 'sc':
                this.strategy = new SuperColliderSynchronicity(this);
                break;
        }
    }
}
SinchronicityManager.gateUpEvent = 'gateUp-event';
SinchronicityManager.gateDownEvent = 'gateDown-event';
/**
 * Base class which encapsulates the algorithm that will sinchronize/match data entered by user in the
 * dosisWeb text editor with the data coming into the dosisWeb server sent by whatever the OSC sender
 * app is (already implemeted strategies (sort of): tidalCycles and SuperCollider; in mind strategies:
 * vcvRack, ableton live -max for live- and PureData; many other strategies could be implemented)
 */
class Strategy {
    /**
     * 
     * @param {SinchronicityManager} syncronization The strategy context
     * @param {AppOSCListener} oscListener an AppOSCListener derived class: it can be a SuperColliderOSCListener,
     * a TidalOSCListener (from here, not implemented yet), a PureDataOSCListner, a VCVRackOSCListener,
     * a AbletonOSCListener or any other that may com into play
     */
    constructor(syncronization,oscListener) {
        this.syncronization = syncronization;
        this.oscListener = oscListener;
        this.sound;
        this.userParams = syncronization.userParams;
    }
    onOscReceived(oscParams){}
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
    constructor(synchronization,oscListener) {
        super(synchronization,oscListener)
        console.log('synchronization: ', synchronization);
        const userParams = this.userParams;
        console.log('userParams: ---', userParams);
    }
}
module.exports = SinchronicityManager;