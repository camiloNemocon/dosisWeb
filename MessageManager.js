const EventEmitter = require('events').EventEmitter;
const babylon = require('babylon');

class MessageManager extends EventEmitter{
	constructor(args) {
		super()
		// code
	}
	parse(msg){

		// console.log("msg : ",msg);
		let parsed = babylon.parse(msg).program.body
		let parsed_keys = Object.keys(parsed)
		// console.log("parsed_keys : ",parsed_keys);
		// debugger
		// console.clear();
		if(parsed.length===1){
			let statement = parsed[0]
			// console.log("statement : ",statement);
			let statementExpression = statement.expression
			// console.log("statement : ",statement);
			let isCallExpression = statementExpression.type==='CallExpression'
			// console.log("isCallExpression : ",isCallExpression);
			let name;
			if(isCallExpression){
				name = statementExpression.callee.name
				// console.log("name : ",name);
			}
			let argumentos = statementExpression.arguments;
			let obj_enviar=[]
			let objectReconstruction=[]
			for(let i = 0; i < argumentos.length;i++){
				let argumento = argumentos[i];
				let objectReconstructed = this.objecReconstructor(argumento)
				objectReconstruction.push(objectReconstructed)
				continue
				// console.log("argumento : ",argumento);
				let isObject = argumento.type==="ObjectExpression";
				console.log("isObject : ",isObject);
				if(isObject){
					argumento.properties.forEach(function(property){
						console.log("key : ",property.key.name);
						console.log("value : ",property.value.value);

					})
				}
				let start = argumento.start;
				let end = argumento.end;
				let object_string = msg.substring(start,end)
				// console.log("msg : ",msg);
				console.log("object_string : ",object_string);
				obj_enviar.push(object_string)
			}
			// console.log("objectReconstruction : ",objectReconstruction);
			this.emit('parsed',msg, name,objectReconstruction)
			return
			// console.clear();
			obj_enviar = "["+obj_enviar.join(',')+"]"
			eval("obj_enviar = "+obj_enviar)
			// console.log("obj_enviar : ",obj_enviar);
			// let o = JSON.parse(obj_enviar)
			// console.log("o : ",o);
			console.log("obj_enviar : ",obj_enviar);
			let firstArgument = argumentos[0]
			// console.log("firstArgument : ",firstArgument);
			let type = firstArgument.type;
			console.log("type : ",type);
			let isObject = type==="ObjectExpression";
			if(isObject){
				let start = firstArgument.start;
				let end = firstArgument.end;
				// console.log("start : ",start);
				// console.log("end : ",end);
				let object_string = msg.substring(start,end)
				// console.log("object_string : ",object_string);
				// let parsed = JSON.parse(object_string)
				// console.log("parsed : ",parsed);
				eval('object_string = '+object_string)
				// console.log("object_string : ",object_string);
				var key;
				for( key in object_string ){
					console.log("key : ",key);
					var object = object_string[key];
					console.log("object : ",object);
				}
				// this.emit('parsed',msg, name,object_string)
			}
			// console.log("firstArgument : ",firstArgument);
		}else{

		}
		// console.log("parsed_keys : ",parsed_keys);
		// console.log("parsed : ",parsed.body);
		// let body = parsed.body;
		// body.forEach(function(expresion){
			// console.log("expresion : ",expresion);

		// })
		return
	    try
	    {
	        // io.emit('chat message', msg);
	        // eval(msg);
	    }
	    catch (e)
	    {
	        // io.emit('eval error', e.toString());
	        console.log("eval error: ",e); 
	        // var trace = stackTrace.parse(e);
	        // console.log("trace : ",trace);
	        // let error = {'eval error':e.toString(),trace}
	        // fs.writeFileSync('log.json',JSON.stringify(error,null,2),'utf8')
	    }

	}
	objecReconstructor(objectExpression){
		// console.log("objectExpression : ",objectExpression);
		let output = {}
		let isObject = objectExpression.type==="ObjectExpression";
		// console.log("isObject : ",isObject);
		if(isObject){
			objectExpression.properties.forEach(function(property){
				let key = property.key.name;
				let value = property.value.value;
				output[key] = value

			})
		}
		return output;
	}
	// methods
}
module.exports = MessageManager;