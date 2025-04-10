<?php
require_once 'db.php';

function createUser($nombre_usuario, $contraseña, $id_rol)
{
    global $pdo;
    try {
        // Encriptar la contraseña
        $passwordHashed = password_hash($contraseña, PASSWORD_BCRYPT);
        $sql = "INSERT INTO USUARIO (nombre_usuario, contraseña, id_rol) 
                VALUES (:username, :password, :id_rol)";
        $stmt = $pdo->prepare($sql);
        // Solo una ejecución
        return $stmt->execute([
            'username' => $nombre_usuario,
            'password' => $passwordHashed,
            'id_rol' => $id_rol
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(["error" => "El nombre de usuario ya está en uso"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Error en base de datos: " . $e->getMessage()]);
        }
        return false;
    }
}


function getUsers()
{
    global $pdo;
    try {
        $sql = "SELECT id_usuario,nombre_usuario,contraseña,id_rol FROM USUARIO";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function deleteUser($id_usuario)
{
    global $pdo;
    try {
        $sql = "DELETE FROM USUARIO WHERE id_usuario = :id_usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function editUser($id_usuario, $nombre_usuario, $contraseña, $id_rol)
{
    global $pdo;
    try {
        $sql = "UPDATE USUARIO SET nombre_usuario = :nombre_usuario, contraseña = :contraseña, id_rol = :id_rol WHERE id_usuario = :id_usuario";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':nombre_usuario', $nombre_usuario);
        $stmt->bindParam(':contraseña', $contraseña);
        $stmt->bindParam(':id_rol', $id_rol);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}


$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');
function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), associative: true);
}

try {

    switch ($method) {
        case 'GET':
            $users = getUsers();
            echo json_encode($users);
            break;
        case 'POST':
            $input = getJsonInput();
            if (isset($input['nombre_usuario']) && isset($input['contraseña']) && isset($input['id_rol'])) {
                $username = $input['nombre_usuario'];
                $password = $input['contraseña'];
                $id_rol = $input['id_rol'];
                if (createUser($username, $password, $id_rol)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Registro de usuario exitoso"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al registrar usuario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "nombre_usuario, contraseña e id_rol son requeridos"]);
            }
            break;
        case 'Delete':
            $input = getJsonInput();
            if (isset($input['id_usuario'])) {
                $id_usuario = $input['id_usuario'];
                if (deleteUser($id_usuario)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Usuario eliminado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al eliminar usuario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "id_usuario es requerido"]);
            }
            break;
        case 'Put':
            $input = getJsonInput();
            if (isset($input['id_usuario']) && isset($input['nombre_usuario']) && isset($input['contraseña']) && isset($input['id_rol'])) {
                $id_usuario = $input['id_usuario'];
                $nombre_usuario = $input['nombre_usuario'];
                $contraseña = $input['contraseña'];
                $id_rol = $input['id_rol'];
                if (editUser($id_usuario, $nombre_usuario, $contraseña, $id_rol)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Usuario editado"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al editar usuario"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "id_usuario, nombre_usuario, contraseña e id_rol son requeridos"]);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(["error" => "Metodo no permitido"]);
            break;
    }


} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error interno del servidor"]);
}
?>