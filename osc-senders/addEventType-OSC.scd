(
~port =  3333;
~port = 12000;
b= NetAddr.new("localhost",~port);
)
(
~port = 12000;
~port =  3333;
a= NetAddr.new("localhost",~port);
)

(
Event.addEventType(\happyEvent, { |server|
    ~octave = [5, 6, 7]; // always play three octaves
    ~detune = 10.0.rand2; // always play a bit out of tune
    ~type = \note; // now set type to a different one
	[~degree,~dur].postln;
	b.sendMsg('/hh',"degree",~degree,"dur",~dur,"detune",~detune);
	// b.sendMsg('/hh',~degree,~dur,~detune);
	a.sendMsg('hh',"degree",~degree,"dur",~dur,"detune",~detune);
 	// a.sendMsg('/hh',~degree,~dur,~detune);
    currentEnvironment.play;
});

Pbind(
	\type, \happyEvent,
	\degree, Pseq([0, 1, 2, 3, 4, 4, 5, 5, 5, 5, 4, 2, 3, 2, 3, 1], inf),
	\dur, Pwhite(0.1, 1.0, inf),
	\amp, 0
).play;
);
s.reboot

s.addr

//SC_UdpInPort: received error

s.stop

s

a.free

b.free

a.disconnect;

b.disconnect;

NetAddr.disconnectAll

NetAddr.connections

NetAddr.langPort;

NetAddr.localAddr;

//thisProcess.openUDPPort;

//thisProcess.openPorts;

// eventTypes
Event.partialEvents.playerEvent.eventTypes
Event.partialEvents.playerEvent.eventTypes.keys
// parentTypes
Event.partialEvents.playerEvent.parentTypes

Event.default.play