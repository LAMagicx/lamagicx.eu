<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require("assets/PHPMailer/src/Exception.php");
require("assets/PHPMailer/src/PHPMailer.php");
require("assets/PHPMailer/src/SMTP.php");

if (isset($_POST["func"]) && !isset($_COOKIE["EmailSent"])) {

    //$mail = new PHPMailer(true);
    ////Server settings
    //$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    //$mail->isSMTP();                                            //Send using SMTP
    //$mail->Host       = 'mail.lamagicx.eu';                     //Set the SMTP server to send through
    //$mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    //$mail->Username   = 'marvin@lamagicx.eu';                   //SMTP username
    //$mail->Password   = 'BOTtgbyhn56';                          //SMTP password
    //$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    //$mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    ////Recipients
    //$mail->setFrom('marvin@lamagicx.eu', 'no-reply');
    //$mail->addAddress($_POST['email'], $_POST['email']);            //Add a recipient
    
    ////Content
    //$mail->isHTML(true);                                        //Set email format to HTML
    //$mail->Subject = $_POST['subject'];
    //$mail->Body    = $_POST['message'];
    //$mail->AltBody = $_POST['message'];

    //$mail->send();
    setcookie("EmailSent", True, time()+30);
    echo json_encode(array("error" => 0));
} else {
    echo json_encode(array("error" => 1));
}
