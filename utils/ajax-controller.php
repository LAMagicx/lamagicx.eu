<?php 

include(get_path("views", "mailtest.php"));

$functionName = $_POST["func"]; // func parameter should be sent in AJAX, determines which function to run
if (function_exists($functionName)) { // check if function exists
    $functionName($_POST); // run function
} else {
    echo json_encode(array("error" => -1, "reason" => "could not find the function"));
}

?>
