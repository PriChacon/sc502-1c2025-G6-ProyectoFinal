<?php
require('db.php');

function login($username, $password)
{
    global $pdo;

    $sql = 'Select * from USUARIO where nombre_usuario = :username';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (password_verify($password, $user['contraseña'])) {
            session_start();
            $_SESSION['user_id'] = $user["id_usuario"];
            $_SESSION['user_role_id'] = $user["id_rol"];
            return true;
        }
    }
    return false;
}

//guardar el tipo de solicitud.
$method = $_SERVER["REQUEST_METHOD"];

if ($method == 'POST') {
    if (isset($_POST['nombre_usuario']) && isset($_POST['contraseña'])) {
        
        $username = $_POST['nombre_usuario'];
        $password = $_POST['contraseña'];
        if (login($username, $password)) {
            http_response_code(200);
            echo json_encode(["message" => "Login exitoso"]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => "Usuario o password incorrecto"]);
        }
    }else{
        http_response_code(400);
        echo json_encode(["error" => "email y password son requeridos"]);
    }
} else {
    http_response_code(response_code: 405);//metodo no permitido
    echo json_encode(["error" => "Metodo no permitido"]);
}