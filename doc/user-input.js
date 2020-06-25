sameTime({pin:2,start:2,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:2,lapse:4})

sameTime({pin:2,start:1,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:3,lapse:4})

prender(2,4,7,8)

apagarTodo()

servo({pin:10,estado:0, start:0, final:90, tiempo:2})

servo({pin:10,estado:0, start:0, final:180, paso:45,tiempo:10})

servo({pin:10,estado:0, start:0, final:180,tiempo:2})
servo({pin:10,estado:0, start:0, final:180,tiempo:4,paso:45})

servo({pin:10,estado:0, start:0, final:45, tiempo:1, paso:5})
servo({pin:10,estado:0, start:0, final:45})
servo({pin:10,estado:1, veces:5,start:0, final:150,tiempo:2})  
servoMotor.stop()
servoMotor.position
servoMotor = new Servo(10)
s2 = new Servo(3)
s2.to(180)
s2.to(0)
servoMotor.to(0)
servoMotor.range = [0,180]
servoMotor.range = [90,180]
servoMotor.to(180)
servoMotor.to(0,4000)
servoMotor.to(0, 2000, 10);
servoMotor.to(180,2000)	
servoMotor.min()
servoMotor.max()
console.log(servoMotor.position)
console.log(servoMotor.value)

console.log(servoMotor.range)
console.log(servoContador)

console.log('hola servidor')

animation = new five.Animation(servoMotor);
a2 = new five.Animation(s2);
console.log(animation)
console.clear()

// Create an animation segment object
animation.enqueue({
  loop:true,
  duration: 3000,
  cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
  keyFrames: [ {degrees: 0}, {degrees: 135}, {degrees: 45}, {degrees: 180}, {degrees: 0}]
});

a2.enqueue({
  loop:true,
  duration: 3000,
  cuePoints: [0, 0.25, 0.5, 0.75, 1.0],
  keyFrames: [ {degrees: 0}, {degrees: 135}, {degrees: 45}, {degrees: 180}, {degrees: 0}]
});

animation.play();

animation.stop()
a2.stop()