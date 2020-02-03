<?php

include "ChromePhp.php";
include "php_chord_transposer.php";

$offset = $_REQUEST['offset'];
$operation = $_REQUEST['operation'];

  if( $operation === 'load') {
    $filename = $_FILES['file']['name'];
    if (!$filename) {
        echo "<p>Unable to open remote file.\n";
        exit;
    }
    
    // name of the directory where the files should be stored
    $targetdir = '';   
    $targetfile = './' . $targetdir.$_FILES['file']['name'];
    ChromePhp::log("Filename: " . $targetfile);
    $filetext = file_get_contents($targetfile);
    echo '<pre>' . str_replace(["\r\n","\r","\n"], "<br />", $filetext) . '</pre>';
  } else 
    if( $operation === 'transpose' ) {  
      $filetext = $_REQUEST['text'];
      $test = new Transposer($filetext, $offset);  
  } else 
    if( $operation === 'save') {
      $filename = $_REQUEST['filename'];
      $filetext = $_REQUEST['text'];      
      $myfile = fopen($filename, "w") or die("Unable to open file!");
      fwrite($myfile, $txt);
      fwrite($myfile, $filetext);
      fclose($myfile);
      echo '<pre>' . str_replace(["\r\n","\r","\n"], "<br />", $filetext) . '</pre>';
}

?>