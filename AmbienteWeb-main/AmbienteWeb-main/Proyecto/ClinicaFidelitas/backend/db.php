<?php
$host = "localhost";
$dbname = "clinica_medica";
$user= "root";
$password = "Curso123";
try{

    $pdo = new PDO("mysql:host=$host;dbname=$dbname",$user,$password);
    $pdo -> setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
  //echo "Conexion exitosa ". PHP_EOL;
    
}catch(PDOException $e){
    die("Error de conexion: " . $e -> getMessage());
}

?>