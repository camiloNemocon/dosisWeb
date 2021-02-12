(
a = NetAddr.new("localhost", 6666);
r = OSCFunc({ |msg, time, tidalAddr|
	var latency = time - Main.elapsedTime;
//	msg = msg ++ ["time", time, "latency", latency];
	msg.postln;
	a.sendBundle(latency, msg)
}, '/play2').fix;
)

a.disconnect

r.free

NetAddr.disconnectAll