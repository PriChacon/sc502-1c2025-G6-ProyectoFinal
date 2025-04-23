<?php

require_once 'db.php';
function createRol($nombre_rol)
{
    global $pdo;
    try {
        $sql = "INSERT INTO ROL (nombre_rol) VALUES (:nombre_rol)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre_rol', $nombre_rol);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function getRoles()
{
    global $pdo;
    try {
        $sql = "SELECT id_rol,nombre_rol FROM ROL";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function editRol($id_rol, $nombre_rol)
{
    global $pdo;
    try {
        $sql = "UPDATE ROL SET nombre_rol = :nombre_rol WHERE id_rol = :id_rol";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_rol', $id_rol);
        $stmt->bindParam(':nombre_rol', $nombre_rol);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function deleteRol($id_rol)
{
    global $pdo;
    try {
        $sql = "DELETE FROM ROL WHERE id_rol = :id_rol";
        $stmt = $pdo->prepare($sql);
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
            $rol = getRoles();
            echo json_encode($rol);
            break;
        case 'POST':
            $input = getJsonInput();
            if (isset($input['nombre_rol'])) {
                $nombre_rol = $input['nombre_rol'];
                if (createRol($nombre_rol)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Rol creado exitosamente"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al crear rol"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "nombre_rol es requerido"]);
            }
            break;
        case 'PUT':
            $input = getJsonInput();
            if (isset($input['id_rol']) && isset($input['nombre_rol'])) {
                $id_rol = $input['id_rol'];
                $nombre_rol = $input['nombre_rol'];
                if (editRol($id_rol, $nombre_rol)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Rol editado exitosamente"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al editar rol"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "id_rol y nombre_rol son requeridos"]);
            }
            break;
        case 'DELETE':
            $input = getJsonInput();
            if (isset($input['id_rol'])) {
                $id_rol = $input['id_rol'];
                if (deleteRol($id_rol)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Rol eliminado exitosamente"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al eliminar rol"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "ID de rol es requerido"]);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(["error" => "Metodo no permitido"]);
            break;
    }

} catch (Exception $e) {
    die("Error de conexion: " . $e->getMessage());
}

?>