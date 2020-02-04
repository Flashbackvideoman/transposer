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
    $targetfile = $targetdir.$_FILES['file']['tmp_name'];   
    $srcfile = $targetdir.$_FILES['file']['name'];
    //ChromePhp::log("Tmp Name: " . $targetfile);
    //ChromePhp::log("Source Name: " . $srcfile);
    $result = move_uploaded_file($srcfile, $targetfile);
    //ChromePhp::log("Result: " . ($result) ? 'true' : 'false');
    $filetext = file_get_contents($targetfile);
    echo '<pre>' . str_replace(["\r\n","\r","\n"], "<br />", $filetext) . '</pre>';
  } else 
    if( $operation === 'transpose' ) {  
      $filetext = $_REQUEST['text'];
     ChromePhp::log("offset: " .  $offset);
    //ChromePhp::log("Source Name: " . $srcfile);
     $newText = new Transposer($filetext, $offset);  
     // ChromePhp::log("offset: " .  $newText);
     echo '<pre>' . str_replace(["\r\n","\r","\n"], "<br />", $newText) . '</pre>';
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