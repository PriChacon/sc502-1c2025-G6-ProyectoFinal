<?php
require_once 'db.php';

function createPaciente($nombre, $apellido, $direccion, $fecha_nacimiento, $telefono)
{
    global $pdo;
    try {
        $sql = "INSERT INTO PACIENTE (nombre_paciente, apellido_paciente, direccion, fecha_nacimiento, telefono) 
                VALUES (:nombre, :apellido, :direccion, :fecha_nacimiento, :telefono)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':direccion', $direccion);
        $stmt->bindParam(':fecha_nacimiento', $fecha_nacimiento);
        $stmt->bindParam(':telefono', $telefono);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear paciente: " . $e->getMessage());
    }
}

function getPacientes()
{
    global $pdo;
    try {
        $sql = "SELECT * FROM PACIENTE";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener pacientes: " . $e->getMessage());
    }
}

function updatePaciente($id_paciente, $nombre, $apellido, $direccion, $fecha_nacimiento, $telefono)
{
    global $pdo;
    try {
        $sql = "UPDATE PACIENTE SET nombre_paciente = :nombre, apellido_paciente = :apellido,
                direccion = :direccion, fecha_nacimiento = :fecha_nacimiento, telefono = :telefono
                WHERE id_paciente = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':direccion', $direccion);
        $stmt->bindParam(':fecha_nacimiento', $fecha_nacimiento);
        $stmt->bindParam(':telefono', $telefono);
        $stmt->bindParam(':id', $id_paciente);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar paciente: " . $e->getMessage());
    }
}

function deletePaciente($id_paciente)
{
    global $pdo;
    try {
        $sql = "DELETE FROM PACIENTE WHERE id_paciente = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id_paciente);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar paciente: " . $e->getMessage());
    }
}

function getPacienteById($id_paciente)
{
    global $pdo;
    try {
        $sql = "SELECT * FROM PACIENTE WHERE id_paciente = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id_paciente);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener paciente: " . $e->getMessage());
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    $json = file_get_contents('php://input');
    return json_decode($json, true);
}

try {
    switch ($method) {
        case 'POST':
            $data = getJsonInput();
            if (createPaciente(
                $data['nombre_paciente'],
                $data['apellido_paciente'],
                $data['direccion'],
                $data['fecha_nacimiento'],
                $data['telefono']
            )) {
                echo json_encode(['message' => 'Paciente creado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear paciente']);
            }
            break;

        case 'GET':
            if (isset($_GET['id_paciente'])) {
                $paciente = getPacienteById($_GET['id_paciente']);
                if ($paciente) {
                    echo json_encode($paciente);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Paciente no encontrado']);
                }
            } else {
                echo json_encode(getPacientes());
            }
            break;

        case 'PUT':
            $data = getJsonInput();
            if (updatePaciente(
                $data['id_paciente'],
                $data['nombre_paciente'],
                $data['apellido_paciente'],
                $data['direccion'],
                $data['fecha_nacimiento'],
                $data['telefono']
            )) {
                echo json_encode(['message' => 'Paciente actualizado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al actualizar paciente']);
            }
            break;

        case 'DELETE':
            if (isset($_GET['id_paciente'])) {
                if (deletePaciente($_GET['id_paciente'])) {
                    echo json_encode(['message' => 'Paciente eliminado exitosamente']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Error al eliminar paciente']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de paciente requerido']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
}
?>
