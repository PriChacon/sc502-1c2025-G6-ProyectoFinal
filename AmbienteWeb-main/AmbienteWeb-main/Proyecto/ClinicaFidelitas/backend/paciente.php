<?php
require_once 'db.php';

function createPaciente($id_usuario, $genero, $fecha_nacimiento)
{
    global $pdo;
    try {
        $sql = "INSERT INTO PACIENTE (id_usuario, genero, fecha_nacimiento) 
                VALUES (:id_usuario, :genero, :fecha_nacimiento)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':genero', $genero);
        $stmt->bindParam(':fecha_nacimiento', $fecha_nacimiento);
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

function updatePaciente($id_paciente, $genero, $fecha_nacimiento)
{
    global $pdo;
    try {
        $sql = "UPDATE PACIENTE SET genero = :genero, fecha_nacimiento = :fecha_nacimiento 
                WHERE id_paciente = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':genero', $genero);
        $stmt->bindParam(':fecha_nacimiento', $fecha_nacimiento);
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
            $id_usuario = $data['id_usuario'];
            $genero = $data['genero'];
            $fecha_nacimiento = $data['fecha_nacimiento'];
            if (createPaciente($id_usuario, $genero, $fecha_nacimiento)) {
                echo json_encode(['message' => 'Paciente creado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al crear paciente']);
            }
            break;
        case 'GET':
            if (isset($_GET['id_paciente'])) {
                $id_paciente = $_GET['id_paciente'];
                $paciente = getPacienteById($id_paciente);
                if ($paciente) {
                    echo json_encode($paciente);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Paciente no encontrado']);
                }
            } else {
                $pacientes = getPacientes();
                echo json_encode($pacientes);
            }
            break;
        case 'PUT':
            $data = getJsonInput();
            $id_paciente = $data['id_paciente'];
            $genero = $data['genero'];
            $fecha_nacimiento = $data['fecha_nacimiento'];
            if (updatePaciente($id_paciente, $genero, $fecha_nacimiento)) {
                echo json_encode(['message' => 'Paciente actualizado exitosamente']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al actualizar paciente']);
            }
            break;
        case 'DELETE':
            if (isset($_GET['id_paciente'])) {
                $id_paciente = $_GET['id_paciente'];
                if (deletePaciente($id_paciente)) {
                    echo json_encode(['message' => 'Paciente eliminado exitosamente']);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'error' => 'Error al elimina paciente'
                    ]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de paciente requerido']);
            }
            break;


        default:
            echo json_encode(['error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
    exit;
}
?>