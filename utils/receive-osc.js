const dgram = require('dgram');

var osc = require('osc-min');

let is_closed = false;

const server = dgram.createSocket ("udp4");

if(window)
window.addEventListener('unload',x=>{
	if(!is_closed)	{
    server.close();
    is_closed = true;
  }
},true);

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
	let pmessage = osc.fromBuffer(msg);
	let address = pmessage.address;
	// console.log("address : ",address);
	let args    = pmessage.args;
	let arg0, arg1;
	arg0 = args[0];
	arg1 = args[1];
	let v0 = arg0.value;
	let v1 = arg1.value;
    if(address==='/scComunicacionDosis'){
        
        console.log('%c'+(v0)+'         ','background-color:red;');
    }
        // do_message_tonada(pmessage.args)
	switch(address){
		/*
		case '/tonada':
			do_message_tonada(pmessage.args)
		break;
		*/
		case '/scComunicacionDosis':
			console.log('%c'+v0+'         ','background-color:red;');
		break;
		case '/scComunicacionDosisCompas':
			console.log('%c'+v0+'              ','background-color:blue;');
		break;
		case '/hh':
		if (v0===1){
			console.log('%c'+(Math.random())+'              ','background-color:red;');
		}
		break;
		case '/bz':
			let amp = v0;
			if(amp===0){
				// console.log('%c'+amp+','+v1+'              ','background-color:cyan;color:black;');
			}else{
				if(v1==4){
					console.log('%c'+amp+','+v1+'              ','background-color:#ffff00;color:black;');
				}else if(v1==0){
					console.log('%c'+amp+','+v1+'              ','background-color:#ff7700;color:black;');
				}else{
					console.log('%c'+amp+','+v1+'              ','background-color:#77ff00;color:black;');

				}
			}
		break;
		default:
			console.log("args : ",args);

	}
});

function do_message_tonada(message_arguments) {
	let arg0 = message_arguments[0];
	let arg1 = message_arguments[1];
	console.log('%c'+'----tonada----'+arg0.value+','+arg1.value,'background-color:green;');
}

server.bind(3333);
