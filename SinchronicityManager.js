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
SinchronicityManager.triggerAttackEvent = 'trigger-attack';
/**
 * Base class which encapsulates the algorithm that will sinchronize/match
 * data entered by user in the
 * dosisWeb text editor with the data coming into the dosisWeb server 
 * sent by whatever the OSC sender
 * app is (already implemeted strategies (sort of): tidalCycles and 
 * SuperCollider; in mind strategies:
 * vcvRack, ableton live -max for live- and PureData; 
 * many other strategies could be implemented)
 */
class Sinchronicity {
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
        console.log('play');
        this.oscListener.on(AppOSCListener.oscReceivedEvent, this.onOscReceived.bind(this))
        this.isPlaying = true;
        
        
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
        const isServo1 = this.userParams.sinc==='servo1';
        // console.log('onOscReceived: ',oscParams);
        const isGate = this.userParams.sinc==='puerta';
        if(isGate){
            this.doGate(this.userParams.pin,this.userParams.tiempo,oscParams);
        }else if(isServo1){
            this.doServoMethod1(this.userParams,oscParams);
        }
    }
    /**
     * emit the gateUpEvent
     * @param {*} pinId 
     * @param {*} gateTime 
     */
    doGate(pinId,gateTime){
        this.syncronization.emit(SinchronicityManager.gateUpEvent,pinId,gateTime);
    }
    doServoMethod1(userParams,oscParams){
        const {pin,angulo} = userParams;
        this.syncronization.emit(SinchronicityManager.triggerAttackEvent,pin,angulo);

    }
}
class TidalSynchronicity extends Sinchronicity {
    /**
     * 
     * @param {SinchronicityManager} synchronization 
     * @param {AppOSCListener} oscListener 
     */
    constructor(synchronization,oscListener) {
        super(synchronization,oscListener)
        this.synchronization =  synchronization;
        // console.log('synchronization: ', synchronization);
        const sound = synchronization.userParams.s;
        this.userParams = synchronization.userParams;
        // console.log('sound: ', sound);
        this.soundName = sound;
        this.play();
    }
    onOscReceived(oscParams){
        console.log('OSC recieved, comparing with what user typed')
        // console.log('oscParams: ----', oscParams);
        const userParams = this.userParams;
        // console.log('userParams: ', userParams);
        const tidalCondition = oscParams.s === userParams.s;
        if(tidalCondition && this.userParams.gate){
            this.doGate(this.userParams.pin,this.userParams.gate,oscParams);
        }

    }
}
class SuperColliderSynchronicity extends Sinchronicity {
    /**
     * 
     * @param {SinchronicityManager} synchronization 
     * @param {SuperColliderOSCListener} oscListener 
     */
    constructor(synchronization,oscListener) {
        super(synchronization,oscListener)
        const userParams = this.userParams;
        console.log('userParams: ---', userParams);
        //get object keys
        const keys = Object.keys(userParams);
        console.log('keys: ', keys);
        this.play()
    }
    // onOscReceived(oscParams){
        // if(isGateCondition && this.userParams.gate){

        // this.doGate(this.userParams.pin,this.userParams.gate,oscParams);
        // }

    // }
    /**
     * Do the gate, only if instrumente conicides 
     * and amplitude is greater than threshold
     * @param {*} pinId 
     * @param {*} gateTime 
     * @param {*} oscParams 
     */
    doGate(pinId,gateTime,oscParams){
        const recievedAmp = oscParams.amp;
        const isInstrument = this.isMatchingInstrument(oscParams);
        const isAmp = recievedAmp > 0;
        const isGateCondition = isInstrument && isAmp;
        if(isGateCondition){
            super.doGate(pinId,gateTime)
        }
    }
    doServoMethod1(userParams,oscParams){
        const isInstrument = this.isMatchingInstrument(oscParams)
        const angulo = userParams.angulo;
        const isAmp = oscParams.amp > 0;
        const isServoCondition = isInstrument && isAmp;
        if(isServoCondition){
            super.doServoMethod1(userParams,oscParams)
        }
    }
    isMatchingInstrument(oscParams){
        const userInstrument = this.userParams.instrument;
        const recievedInstrument = oscParams.instrument;
        return recievedInstrument === userInstrument;
    }
}
module.exports = SinchronicityManager;