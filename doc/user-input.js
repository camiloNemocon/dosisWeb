sameTime({pin:2,start:2,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:2,lapse:4})

sameTime({pin:2,start:1,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:3,lapse:4})

prender(2,4,7,8)

apagarTodo()

stepper({pines:[2,3,4,5],sentido:derecha,rpm:180,estado:0,circuito:L293D,motor:nema17})
stepper({pines:[2,3,4,5],tiempo:20,estado:0,circuito:L293D,motor:nema17})
stepper({pines:[2,3,4,5],sentido:derecha,rpm:180,estado:1,pinFin:1})

servo({pin:10,estado:0, start:10, final:0, tiempo:3, pasos:3})
servo({pin:10,estado:0, start:10, final:150, tiempo:3, pasos:3})
servo({pin:10,estado:4, start:10, final:150, tiempo:3, pasos:3})
servo({pin:10,estado:3, start:10, final:150, tiempo:2, pasos:4})
servo({pin:10,estado:3, start:170, final:170, tiempo:2, pasos:3})
servo({pin:10,estado:5, start:90, final:180, tiempo:2, pasos:3})
servo({pin:10,estado:5, start:0, final:180, tiempo:2, pasos:3})

servo({pin:10,estado:2, start:10, final:0, tiempo:2})
servo({pin:10,estado:2, start:10, final:180, tiempo:2})
servo({pin:10,estado:1, start:10, final:170, tiempo:2})
servo({pin:10,estado:1, start:10, final:170, tiempo:2})

apagarServos()

servo({pin:10,estado:0, start:0, final:180, paso:45,tiempo:10})

servo({pin:10,estado:0, start:0, final:180,tiempo:2})
servo({pin:10,estado:0, start:0, final:180,tiempo:4,paso:45})

servo({pin:10,estado:0, start:0, final:45, tiempo:1, paso:5})
servo({pin:10,estado:0, start:0, final:45})
servo({pin:10,estado:1, veces:5,start:20, final:10,tiempo:2})  
servo({pin:10,estado:0, veces:5,start:20, final:90,tiempo:0.5})  
servo({pin:10,estado:2, veces:5,start:20, final:115,tiempo:0.5})  
