<?php
require_once 'db.php';

function createEspecialidad($nombre)
{
    global $pdo;
    try {
        $sql = "INSERT INTO ESPECIALIDAD (nombre_especialidad) VALUES (:nombre)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function getEspecialidades()
{
    global $pdo;
    try {
        $sql = "SELECT id_especialidad, nombre_especialidad FROM ESPECIALIDAD";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function deleteEspecialidad($id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM ESPECIALIDAD WHERE id_especialidad = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function updateEspecialidad($id, $nombre)
{
    global $pdo;
    try {
        $sql = "UPDATE ESPECIALIDAD SET nombre_especialidad = :nombre WHERE id_especialidad = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function getEspecialidadById($id)
{
    global $pdo;
    try {
        $sql = "SELECT id_especialidad, nombre_especialidad FROM ESPECIALIDAD WHERE id_especialidad = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    $input = file_get_contents("php://input");
    if (!empty($input)) {
        return json_decode($input, true);
    }
    return null;
}

try {
    switch ($method) {
        case 'GET':
            $especialidades = getEspecialidades();
            echo json_encode($especialidades);
            break;
        case 'POST':
            $input = getJsonInput();
            if (isset($input['nombre_especialidad'])) {
                $nombre = $input['nombre_especialidad'];
                if (createEspecialidad($nombre)) {
                    http_response_code(201);
                    echo json_encode(["message" => "Especialidad creada exitosamente"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al crear especialidad"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Nombre de especialidad es requerido"]);
            }
            break;
        case 'DELETE':
    
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            
            if (!$id) {
                $input = getJsonInput();
                $id = isset($input['id_especialidad']) ? $input['id_especialidad'] : null;
            }
            
            if ($id) {
                if (deleteEspecialidad($id)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Especialidad eliminada exitosamente"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al eliminar especialidad"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "ID de especialidad es requerido"]);
            }
            break;
        case 'PUT':

            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $input = getJsonInput();
            
            if (!$id && isset($input['id_especialidad'])) {
                $id = $input['id_especialidad'];
            }
            
            $nombre = isset($input['nombre_especialidad']) ? $input['nombre_especialidad'] : null;
            
            if ($id && $nombre) {
                if (updateEspecialidad($id, $nombre)) {
                    http_response_code(200);
                    echo json_encode(["message" => "Especialidad actualizada exitosamente"]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => "Error al actualizar especialidad"]);
                }
            } else {
                http_response_code(400);
                echo json_encode(["error" => "ID y nombre de especialidad son requeridos"]);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(["error" => "Metodo no permitido"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
    exit;
}
?>