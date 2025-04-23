<?php
require('db.php');

function userRegistry($username, $password, $id_rol){
    try{
        global $pdo;
        //encriptacion del password de usuario
        $passwordHashed = password_hash($password, PASSWORD_BCRYPT);
        $sql = "INSERT INTO USUARIO (nombre_usuario, contraseña, id_rol) values (:username, :password, :id_rol)";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(params: ['username' => $username, 'password' => $passwordHashed, 'id_rol' => $id_rol]);
        return "User registered";
        
    }catch(Exception $e){

    }
}



$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['nombre_usuario']) && isset($input['contraseña']) ) {
        $username = $input['nombre_usuario'];
        $password = $input['contraseña'];
        $id_rol = 2;
        if (userRegistry($username, $password, $id_rol)) {
            http_response_code(200);
            echo json_encode(["message" => "Registro de usuario exitoso"]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => "Error al registrar usuario"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "email y password son requeridos"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Metodo no permitido"]);
}
