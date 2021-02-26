// ___  _ _  _ ____ ____ 
// |__] | |\ | |___ [__  
// |    | | \| |___ ___] 
sameTime({pin:2,start:2,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:2,lapse:4})

sameTime({pin:2,start:1,lapse:4},{pin:4,start:2,lapse:4},{pin:7,start:3,lapse:4})

prender(2,4,7,8)

//por defecto el intervalo es de 1000
loopArduino(2,3,4,5) 
cambiarIntervalo(500)
onceArduino(2,4);
detenerLoop()

apagarTodo()
// __  ___  ___  __   __   ___  __  
// /__`  |  |__  |__) |__) |__  |__) 
// .__/  |  |___ |    |    |___ |  \ 
// http://patorjk.com/software/taag/#p=display&f=Stick%20Letters

// __  ___  ___  __   __   ___  __  
// /__`  |  |__  |__) |__) |__  |__) 
// .__/  |  |___ |    |    |___ |  \ 
// http://patorjk.com/software/taag/#p=display&f=JS%20Stick%20Letters
// http://patorjk.com/software/taag/#p=display&f=Ivrit

// __ _____ _____ _____ _____ _____ _____ 
// ((   ||   ||==  ||_// ||_// ||==  ||_// 
// \_))  ||   ||___ ||    ||    ||___ || \\ 


// ____ ___ ____ ___  ___  ____ ____ 
// [__   |  |___ |__] |__] |___ |__/ 
// ___]  |  |___ |    |    |___ |  \ 
// http://patorjk.com/software/taag/#p=display&f=Cybermedium


// ███████╗████████╗███████╗██████╗ ██████╗ ███████╗██████╗ 
// ██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
// ███████╗   ██║   █████╗  ██████╔╝██████╔╝█████╗  ██████╔╝
// ╚════██║   ██║   ██╔══╝  ██╔═══╝ ██╔═══╝ ██╔══╝  ██╔══██╗
// ███████║   ██║   ███████╗██║     ██║     ███████╗██║  ██║
// ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝
// http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow                                                         
stepper({pines:[2,3,4,5],tiempo:5,estado:0,circuito:L293D,motor:nema17})
stepper({pines:[2,3,4,5],sentido:horario,rpm:180,estado:0,circuito:L293D,motor:nema17})
stepper({pines:[2,3,4,5],tiempo:20,estado:0,circuito:L293D,motor:nema17})
stepper({pines:[2,3,4,5],sentido:horario,rpm:180,estado:1,pinFin:1})
stepper({pines:[2,3,4,5],sentido:horario,rpm:15,pasos:2048,circuito:uln2003,motor:byj48,estado:0})
stepper({pines:[2,3,4,5],sentido:horario,rpm:15,vueltas:0.5,circuito:uln2003,motor:byj48,estado:0})
stepper({pines:[3,4],sentido:horario,rpm:180,vueltas:0.5,circuito:a4988,motor:nema17,estado:0,pinParar:2,id:1})
stepper({pines:[3,4],sentido:horario,rpm:180,pasos:200,circuito:a4988,motor:nema17,estado:1,pinParar:2,id:1})

detenerPAP()
apagarSteppers()

// ____ ____ ____ _  _ ____ 
// [__  |___ |__/ |  | |  | 
// ___] |___ |  \  \/  |__| 
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