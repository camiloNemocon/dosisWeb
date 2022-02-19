# live coding microcontrollers through javascript
Live coded arduino actuators using the following javascript libraries:

* [johnny-five](http://johnny-five.io/), 
* [socket.io](https://socket.io/), and 
* [codemirror](https://codemirror.net/) 


# Instrucciones

- Instalar node.js https://nodejs.org/es/
- Obtener el código, hay 3 opciones:
  - clonarlo con git
  - bajarlo con github desktop
  - descargar el .zip
- En la consola de comandos, navegar hasta la carpeta donde se descargó el código. Una vez ahí seguir los siguientes pasos: 
- Instalar los módulos o bibliotecas o _libraries_ de node, es decir, en la consola de comandos ejecutar o correr el comando `npm i`
- Conectar el arduino al puerto serial
- instalar firmata
  - https://firmata.netlify.app/
  - o usando arduino
- Correr el servidor, es decir, en la consola de comandos ejecutar o correr `node index.js`
- Abrir <a href="http://localhost:3000" target="_blank">localhost:3000</a>

# OSC

Open sound control (OSC) es un protocolo de comunicación entre hardware y software (hardware-software y software-software) que está implementado en node y que por lo tanto permite la comunicación entre programas escritoes en node con otro hardware y software. Este es el caso de dosisWeb en donde hay funcionalidad programada para que desde software como Supercollider y TidalCycles, que pueden enviar y recibir mensajes del protocolo OSC, se pueda controlar el mismo microcontrolador conectado a dosisWeb.  
