/* jshint esversion: 6 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
/* eslint-disable no-control-regex */


var offset = 0;
var fileText = "";
var fileName = "";
var fileData = null;
const saveToFile = 'transposed.tmp';

// Load the file
function loadup(op) {
  if( op === null) {
    let fn = $("#infile");
    fileData = fn[0].files[0];
  } else {
    fileData = op;
  }

  offset = 0;
  $('#downloadfile').empty();

  uploadMusicFile(fileData, function(data) {
    fileText = data;
    var c;
    for(var i = 0; i < fileText.length; i++) {
      if((c = fileText.charCodeAt(i)) > 128) {
          if( c === 65533) {
            fileText = fileText.substr(0, i) + "'" + fileText.substr(i+1);
          }
      }
    }
    displayMusicArray(fileText);    
  });
}

function selectText() {
    var node = document.getElementById("filetext");

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
      return;
    }
  /* Copy the text inside the text field */
  document.execCommand("copy");
  document.getSelection().removeAllRanges();
  alert("Music text saved to clipboard");

}

// [re]display the file
function displayMusicArray(m) {
  $('#outfile').show();
  $('#copytext').show();
  $('#cleartext').show();
  $('#savefile').empty();
  $('#filetext').empty().html(m);
}

function getFile(filename, offset, cb) {  
    let operation = "load";
    var formData = new FormData();
    formData.append('filename', filename);
    formData.append('offset', offset);
    formData.append('operation', operation);

    $.ajax({
      url: 'transpose.php',
      type: 'POST',
    //  dataType: "text/plain",
      processData: false,  // tell jQuery not to process the data
      contentType: false,  // tell jQuery not to set contentType
      data: formData,
      success: function(data) {
        if (cb) {
          cb.call(this, data);
        }
      },
      error: function(jqXHR) {
         if (cb) {
          cb(jqXHR.responseText);
        }
      }
    });
}


function plus() {
  offset++;
  if(offset > 11) {
    offset = 11;
  }
  $("#offset").val(offset);
  retranspose();
}

function minus() {
  offset--;
  if(offset < -11) {
    offset = -11;
  }
  $("#offset").val(offset);
  retranspose();
}

function retranspose() {
  //debugger;
  transposeFile(fileText, offset, function(data) {
    displayMusicArray(data);    
  });
}

function transposeFile(ftext, offset, cb) {  
    let operation = "transpose";
    let t = ftext.replace(new RegExp('<br />', 'g'), '\n');
    t = t.replace(/<[^>]*>?/gm, '');
    $.ajax({
      url: 'transpose.php',
      type: 'POST',
      dataType: "text/plain",
      data: {
          text: t, offset: offset, operation: operation
      },
      success: function(data) {
        if (cb) {
          cb.call(this, data.replace('\n', '<br />'));
        }
      },
      error: function(jqXHR) {
         if (cb) {
          cb(jqXHR.responseText);
        }
      }
    });
}

function saveFile() {
    let operation = "save";
    let rawText = $('#filetext').html();
    let t = rawText.replace(new RegExp('<br />', 'g'), '\n');
    t = rawText.replace(new RegExp('<br>', 'g'), '\n');
    t = t.replace(/<[^>]*>?/gm, '');
  
    $.post( 'transpose.php',  {filename: saveToFile, text: t, operation: operation}  );

    $('#downloadfile').empty();  
    let a = $('<a href="' + saveToFile + '" download="' + fileName + '" id="savefile">Download File</a>').appendTo('#downloadfile');
}

function dropHandler(e) {
  console.log('File(s) dropped');

  // Prevent default behavior (Prevent file from being opened)
  e.stopPropagation();
  e.preventDefault();
  if (e.dataTransfer.items) {      
      var f = e.dataTransfer.files[0];    
      if (e.dataTransfer.items[0].kind === 'file') {
        loadup(f); 
        console.log(f.name);
      }
  }  
}

function dragOverHandler(ev) {
  ev.preventDefault();
}

function dragEnterHandler(ev) {
  ev.preventDefault();
}

function dragLeaveHandler(ev) {
  ev.preventDefault();
}

function clearText() {
  var offset = 0;
  var fileText = "";
  var fileName = "";
  var fileData = null;
  $('#outfile').hide();
  $('#copytext').hide();
  $('#cleartext').hide();
  $('#savefile').empty();
  $('#filetext').empty();
  $('#infile').val('');
}

function handlepaste(ev) {
  ev.preventDefault();
  let t = ev.clipboardData.getData('text');
  offset = 0;
  var rx = new RegExp(/(\r\n)+/, 'gm');
  fileText = '<pre>' + t.replace(rx, "<br />") + '</pre>';
  fileName = "";
  displayMusicArray(fileText);
}

// Upload a new music file to server and return the file data
function uploadMusicFile(file_data, cb) {
    var form_data = new FormData();                  
    form_data.append('file', file_data);                          
    form_data.append('operation', 'load');                          
    form_data.append('offset', 0);                          
    $.ajax({
        url: 'transpose.php', // point to server-side PHP script 
        dataType: 'text',  // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(data){
          //alert(data); // display response from the PHP script, if any
          if( cb ) {
            cb(data);
          }
          /*
          fileText = data;
          var c;
          for(var i = 0; i < fileText.length; i++) {
            if((c = fileText.charCodeAt(i)) > 128) {
                if( c === 65533) {
                  setCharAt(fileText,i,"'");
                }
            }
          }
          $("#filetext").html(fileText);
          */
        }
     });
}


// Utilities
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

