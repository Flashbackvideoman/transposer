<?php
/* transpose.php
  Copyright (c) 2020, Norman N. Strassner
*/

include "ChromePhp.php";
include "php_chord_transposer.php";

$operation = $_REQUEST['operation'];

  if( $operation === 'load') {
    $filename = $_FILES['file']['name'];
    if (!$filename) {
        echo "<p>Unable to open remote file.\n";
        exit;
    }
    $offset = $_REQUEST['offset'];
    ChromePhp::log("Source Name: " . $_FILES['file']['tmp_name']);
    // name of the directory where the files should be stored
    $targetfile = $_FILES['file']['tmp_name'];   
    $srcfile = $_FILES['file']['name'];
    $result = move_uploaded_file($srcfile, $targetfile);
    //ChromePhp::log("Result: " . ($result) ? 'true' : 'false');
    $filetext = file_get_contents($targetfile);
    echo '<pre>' . str_replace(["\r\n","\r","\n"], "<br />", $filetext) . '</pre>';
  } else 
    if( $operation === 'transpose' ) {  
      $offset = $_REQUEST['offset'];
      $filetext = $_REQUEST['text'];
      $newText = new Transposer($filetext, $offset);  
     // ChromePhp::log("offset: " .  $newText);
  } else 
    if( $operation === 'save') {
      $filename = $_REQUEST['filename'];
      $filetext = $_REQUEST['text'];      
      $myfile = fopen($filename, "w") or die("Unable to open file!");
      fwrite($myfile, $txt);
      fwrite($myfile, $filetext);
      fclose($myfile);
      echo '<pre>' . str_replace(["\r\n","\r","\n"], "<br />", $filetext) . '</pre>';
    } else
      if( $operation === 'help') {
        $help = file_get_contents('transpose_help.html');
        //ChromePhp::log("help: " .  $help);
        echo $help;
      } else
      if( $operation === 'present') {
        $present = file_get_contents('transpose_present.html');
        //ChromePhp::log("present: " .  present);
        echo $present;
      }

?>