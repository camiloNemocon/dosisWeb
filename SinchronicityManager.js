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
                this.strategy = new SuperColliderSynchronicity(this,oscListener);
                break;
        }
    }
    update(userParams){
        this.strategy.update(userParams);
    }
}
SinchronicityManager.gateUpEvent = 'gateUp-event';
SinchronicityManager.triggerAttackEvent = 'gateUp-event';
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
        this.userParams = syncronization.userParams;
        this.isPlaying = false;
    }
    play(){
        this.oscListener.on(AppOSCListener.oscReceivedEvent, this.onOscReceived.bind(this))
        this.isPlaying = false;
        
        
    }
    stop(){
        this.oscListener.removeListener(AppOSCListener.oscReceivedEvent, this.onOscReceived.bind(this))
        this.isPlaying = false;

    }
    update(userParams){
        this.stop();
        this.userParams=userParams;
        if(!this.isPlaying){
            this.play();
        }
    }
    onOscReceived(oscParams){
        const isGate = this.userParam.sinc==='puerta';
        const isServo1 = this.userParam.sinc==='servo';

        if(isGate){
            this.doGate(oscParams.pinId,oscParams.gateTime);
        }else if(isServo1){
            this.doServoMethod1(oscParams.pinId,oscParams.angle,oscParams.time);
        }
    }
    doGate(pinId,gateTime,oscParams){
        const userInstrument = this.userParams.instrument;
        const recievedInstrument = oscParams.instrument;
        const recievedAmp = oscParams.amp;
        const isInstrument = recievedInstrument === userInstrument
        const isAmp = recievedAmp > 0;
        const isGateCondition = isInstrument && isAmp;
        if(isGateCondition){

            // this.doGate(this.userParams.pin,this.userParams.gate);
            this.syncronization.emit(SinchronicityManager.gateUpEvent,pinId,gateTime);
        }
    }
    doServoMethod1(pinId,angle,time){
        this.syncronization.emit(SinchronicityManager.triggerAttackEvent,pinId,angle,time);

    }
    stop(){}
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
    onOscReceived(oscParams){
        console.log('oscParams: ----', oscParams);
        const userParams = this.userParams;
        console.log('userParams: ', userParams);
        const tidalCondition = oscParams.s === userParams.s;
        if(tidalCondition && this.userParams.gate){
            this.doGate(this.userParams.pin,this.userParams.gate,oscParams);
        }

    }
}
class SuperColliderSynchronicity extends Strategy {
    constructor(synchronization,oscListener) {
        super(synchronization,oscListener)
        const userParams = this.userParams;
        console.log('userParams: ---', userParams);
        //get object keys
        const keys = Object.keys(userParams);
        console.log('keys: ', keys);
        this.play()
    }
    onOscReceived(oscParams){
        const userInstrument = this.userParams.instrument;
        const recievedInstrument = oscParams.instrument;
        const recievedAmp = oscParams.amp;
        const isInstrument = recievedInstrument === userInstrument
        const isAmp = recievedAmp > 0;
        const isGateCondition = isInstrument && isAmp;
        if(isGateCondition && this.userParams.gate){

            this.doGate(this.userParams.pin,this.userParams.gate,oscParams);
        }

    }
}
module.exports = SinchronicityManager;