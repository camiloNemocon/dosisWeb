require('codemirror/mode/javascript/javascript')
// console.clear();
let APP_NAME = "com.maqpattrrrrxnxs.dosisweb";
console.log("APP_NAME : ",APP_NAME);
var socket;
let codigo='';
var editor;
$(function () {
  socket = io();
  /*
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  */
  socket.on('chat message', function(msg){
    $('#messages').prepend($('<li>').text(msg));
    // window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on('eval error', function(msg){
    console.log("msg : ",msg);
    $('#messages').prepend($('<li>').text(msg));
    // window.scrollTo(0, document.body.scrollHeight);
  });
  // console.log("codigo : ",codigo);
  editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    
    //auto complete  
    lineNumbers: true,
    
    //active line
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true,

    //cerrar ] ) }
    autoCloseBrackets: true,

    //fondo
    lineNumbers: true,
    // theme: "tomorrow-night-eighties",
    mode:{name: 'javascript', globalVars: true},
    mode:'javascript',
    //comandos de taclado
    extraKeys:
    {
      "Ctrl-Space": "autocomplete",
      "Alt-Enter": function(cm) 
      {  
        linea=cm.getLine(cm.getCursor().line);
        let codigoUltimo = cm.doc.getValue();
        let string_para_guardar = JSON.stringify({codigo:codigoUltimo})
        localStorage.setItem(APP_NAME,string_para_guardar)
        socket.emit('chat message',linea); 
        console.log(linea); 
      },
      "F7": function(cm) {  cm.getValue(); console.log(cm.getValue());document.querySelector('#messages').innerHTML = ''},
      "F11": function(cm) { cm.setOption("fullScreen", !cm.getOption("fullScreen")); },
      "Esc": function(cm) { if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);},
      'Ctrl-Enter': function(cm) {
        var text = selectCurrentBlock(cm)
        guardar_en_localStorage(cm);
        console.log('text : ', text)
        socket.emit('chat message',text); 
      },
      'Shift-Ctrl-K':function(cm){
        //https://community.hubspot.com/t5/CMS-Development/Keyboard-shortcut-for-duplicate-line-was-changed-in-new-design/td-p/193331
        var current_cursor = cm.doc.getCursor();
        var line_content = cm.doc.getLine(current_cursor.line);
        CodeMirror.commands.goLineEnd(cm);
        CodeMirror.commands.newlineAndIndent(cm);
        CodeMirror.commands.goLineLeft(cm);
        cm.doc.replaceSelection(line_content);
        cm.doc.setCursor(current_cursor.line + 1, current_cursor.ch);
        return
        cm.operation(function() {
          console.log("cm : ",cm);
          var rangeCount = cm.listSelections().length;
          console.log("rangeCount : ",rangeCount);
          for (var i = 0; i < rangeCount; i++) {
            var range = cm.listSelections()[i];
            if (range.empty())
              cm.replaceRange(cm.getLine(range.head.line) + "\n", Pos(range.head.line, 0));
            else
              cm.replaceRange(cm.getRange(range.from(), range.to()), range.from());
          }
          cm.scrollIntoView();
        });            
      } 
    }
  });
  let string_guardada = localStorage.getItem(APP_NAME)
  // console.log("string_guardada : ",string_guardada);
  let objeto_guardado;
  if(string_guardada){
    objeto_guardado = JSON.parse(string_guardada)
    // console.log("objeto_guardado : ",objeto_guardado);
    if(objeto_guardado.codigo){
      document.getElementById("code").value=objeto_guardado.codigo;
      editor.doc.setValue(objeto_guardado.codigo)
    }
  }
});
function guardar_en_localStorage(editor_instance) {
  let codigoUltimo = editor_instance.doc.getValue();
  let string_para_guardar = JSON.stringify({codigo:codigoUltimo})
  localStorage.setItem(APP_NAME,string_para_guardar)
}
/*
hydra
 */
function selectCurrentBlock () { // thanks to graham wakefield + gibber
  var pos = editor.getCursor()
  var startline = pos.line
  var endline = pos.line
  var currentText = editor.getLine(startline).trim();
  while (startline > 0 && currentText !== '') {
    startline--
    currentText = editor.getLine(startline).trim();
  }
  currentText = editor.getLine(endline).trim();
  while (endline < editor.lineCount() &&  currentText!== '') {
    endline++
    currentText = editor.getLine(endline).trim();
  }
  var pos1 = {
    line: startline,
    ch: 0
  }
  var pos2 = {
    line: endline,
    ch: 0
  }
  var str = editor.getRange(pos1, pos2)
  return str
  return {
    start: pos1,
    end: pos2,
    text: str
  }
}
window.addEventListener("keydown", function(event) {
  if((event.ctrlKey || event.metaKey) &&event.shiftKey &&event.code == "keyK") {
    event.preventDefault();
  }
})
  