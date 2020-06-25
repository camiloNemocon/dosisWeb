// Animate a single servo instance
var servo = new five.Servo(9);
var animation = new five.Animation(servo);

============================
// Independently animate the servos in a Servo.Array
var servos = new five.Servos([9,10,11]);
var animation = new five.Animation(servos);

============================
// Animate a Servo and Servo.Array. When passed as the member of an array, the 
// Servo.Array will be passed the same value for all devices in the Servo.Array
var servo = new five.Servo(9);
var servos = new five.Servos([10,11]);
var animation = new five.Animation([servo, servos]);

============================
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var servo = new five.Servo(9);
  var animation = new five.Animation(servo);

  // Create an animation segment object
  animation.enqueue({
    duration: 2000,
    cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
    keyFrames: [ {degrees: 0}, {degrees: 135}, {degrees: 45}, {degrees: 180}, {degrees: 0}]
  });
});

servo({pin:10,estado:0, start:0, final:90, tiempo:2})

servo({pin:10,estado:0, start:0, final:180, paso:45,tiempo:10})

servo({pin:10,estado:0, start:0, final:180,tiempo:2})
servo({pin:10,estado:0, start:0, final:180,tiempo:4,paso:45})

servo({pin:10,estado:0, start:0, final:45, tiempo:1, paso:5})
servo({pin:10,estado:0, start:0, final:45})
servo({pin:10,estado:1, veces:5,start:0, final:150,tiempo:2}) 
============================
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var servos = new five.Servos([9, 10, 11]);
  var animation = new five.Animation(servos);

  // Create an animation segment object
  animation.enqueue({
    duration: 2000,
    cuePoints: [0, 0.5, 1.0],
    keyFrames: [ 
      [{degrees: 0}, {degrees: 135}, {degrees: 180}],
      [{degrees: 0}, {degrees: 90}, {degrees: 180}],
      [{degrees: 0}, {degrees: 45}, {degrees: 180}]
    ]
  });
});

============================
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var servo = new five.Servo(9);
  var animation = new five.Animation(servo);

  // Create an animation object
  animation.enqueue({
    duration: 2000,
    cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
    keyFrames: [ {degrees: 0}, {degrees: 135}, {degrees: 45}, {degrees: 180}, {degrees: 0}]
  });
});

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, 90, -135, 20, 70 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ null, 90, -135, 20, 70 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, 90, -135, 20, null ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, 90, null, 20, -155 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, 90, false, 20, -155 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, {step: 90}, -135, 20, 70 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, {degrees: 180}, -135, 20, 70 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, {degrees: 180, easing: "inOutCirc", -135, 20, 70 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, 90, -135, { copyDegrees: 1 }, -45 ], ...

============================
// servo.last.degrees === 90
... cuePoints: [0, 0.25, 0.5, 0.75, 1], keyFrames : [ -45, 90, -135, { copyFrame: 1 }, 70 ], ...

============================
// two-tuple
...  cuePoints: [0, 0.5, 1], keyFrames : [ { position: [10, 10 ] }, { position: [20, 50 ] }, { position: [10, 10 ] } ] ...

// three-tuple
...  cuePoints: [0, 0.5, 1], keyFrames : [ { position: [10, 10, 0 ] }, { position: [20, 50, 90 ] }, { position: [10, 10, 0 ] } ] ...
