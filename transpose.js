/* transpose.js
  Copyright (c) 2020, Norman N. Strassner
*/
/* jshint esversion: 6 */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
/* eslint-disable no-control-regex */
'use strict';

var keyOffset = 0;
var fileText = "";
var fileName = "";
var rawText = "";
var transposedText = "";
var fileData = null;
const saveToFile = 'transposed.txt';

// Load the file
function loadup(op) {
  if( op === null) {
    let fn = $("#infile");
    fileData = fn[0].files[0];
  } else {
    fileData = op;
  }

  keyOffset = 0;
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
  $('#plusminusbuttons').show();
  $('#outfile').show();
  $('#copytext').show();
  $('#cleartext').show();
  $('#present').show();
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

function helpText() {
  loadHTMLFile("help", function(data) {
    var w = window.open('', '_blank', "toolbar=no,scrollbars=yes,resizable=yes"); 
    w.document.title = "Transposer Help"
    $(w.document.body).html(data);
    $("#infile").focus();
  });
}

function presentText() {
   loadHTMLFile("present", function(data) {
   var w = window.open('', '_blank', "toolbar=no,scrollbars=yes,resizable=yes"); 
     w.document.write(data);
     w.document.title = "Transposed Chart"
    $(w.document.body).find("#musicchart").html($('#filetext').html());
   });
}

function plus() {
  keyOffset++;
  if(keyOffset > 11) {
    keyOffset = 0;
  }
  $("#offset").val(keyOffset);
  retranspose();
}

function minus() {
  keyOffset--;
  if(keyOffset < -11) {
    keyOffset = 0;
  }
  $("#offset").val(keyOffset);
  retranspose();
}

function retranspose() {
  //debugger;
  transposeFile(fileText, keyOffset, function(data) {
    displayMusicArray(data);    
  });
}

function saveFile() {
    let operation = "save";
    let h = $('#filetext').html();
    rawText = h.replace(new RegExp('<br />', 'g'), '\n');
    rawText = h.replace(new RegExp('<br>', 'g'), '\n');
    rawText = rawText.replace(/<[^>]*>?/gm, '');
  
    $.post( 'transpose.php',  {filename: saveToFile, text: rawText, operation: operation}  );

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
  var keyOffset = 0;
  var fileText = "";
  var fileName = "";
  var fileData = null;
  $('#plusminusbuttons').hide();
  $('#outfile').hide();
  $('#copytext').hide();
  $('#cleartext').hide();
  $('#present').hide();
  $('#savefile').empty();
  $('#filetext').empty().text("Paste song text here");
  $('#infile').val('');
}

function handlepaste(ev) {
  ev.preventDefault();
  let t = ev.clipboardData.getData('text');
  keyOffset = 0;
  var rx = new RegExp(/(\r\n)+/, 'gm');
  fileText = '<pre>' + t.replace(rx, "<br />") + '</pre>';
  fileName = "";
  displayMusicArray(fileText);
}

// Get help file

function loadHTMLFile(type, cb) {
    var form_data = new FormData();                  
    form_data.append('operation', type);                          
    $.ajax({
        url: 'transpose.php', // point to server-side PHP script 
        dataType: 'text',  // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(data){
          if( cb ) {
            cb(data);
          }
        },
       error: function(jqXHR) {
         if (cb) {
          cb(jqXHR.responseText);
        }
      }
     });
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
        },
      error: function(jqXHR) {
         if (cb) {
          cb(jqXHR.responseText);
        }
      }
     });
}

function transposeFile(ftext, offset, cb) {  
    let t = ftext.replace(new RegExp('<br />', 'g'), '\n');
    t = t.replace(/<[^>]*>?/gm, '');
    var form_data = new FormData(); 
    form_data.append('text', t);                          
    form_data.append('operation', 'transpose');                          
    form_data.append('offset', offset);        
    $.ajax({
      url: 'transpose.php',
      type: 'POST',
      dataType: 'text',  // what to expect back from the PHP script, if anything
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,
      success: function(data) {
        if (cb) {
          cb(data.replace('\n', '<br />'));
        }
      },
      error: function(jqXHR) {
         if (cb) {
          cb(jqXHR.responseText);
        }
      }
    });
}


// Utilities
function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

