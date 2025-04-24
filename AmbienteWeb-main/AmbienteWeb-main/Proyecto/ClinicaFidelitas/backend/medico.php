<?php
require_once 'db.php';

// Crear un médico
function createMedico($nombre_medico, $apellido, $id_especialidad, $telefono, $horario)
{
    global $pdo;
    try {
        $sql = "INSERT INTO MEDICO (nombre_medico, apellido, id_especialidad, telefono, horario) 
                VALUES (:nombre_medico, :apellido, :id_especialidad, :telefono, :horario)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre_medico', $nombre_medico);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':id_especialidad', $id_especialidad);
        $stmt->bindParam(':telefono', $telefono);
        $stmt->bindParam(':horario', $horario);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear médico: " . $e->getMessage());
    }
}

// Obtener todos los médicos
function getMedicos()
{
    global $pdo;
    try {
        $sql = "SELECT 
                    m.id_medico, 
                    m.nombre_medico, 
                    m.apellido, 
                    e.nombre_especialidad, 
                    m.telefono, 
                    m.horario
                FROM MEDICO m
                LEFT JOIN ESPECIALIDAD e ON m.id_especialidad = e.id_especialidad";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener médicos: " . $e->getMessage());
    }
}
// Actualizar un médico
function updateMedico($id_medico, $nombre_medico, $apellido, $id_especialidad, $telefono, $horario)
{
    global $pdo;
    try {
        $sql = "UPDATE MEDICO 
                SET nombre_medico = :nombre_medico, apellido = :apellido, 
                    id_especialidad = :id_especialidad, telefono = :telefono, horario = :horario 
                WHERE id_medico = :id_medico";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre_medico', $nombre_medico);
        $stmt->bindParam(':apellido', $apellido);
        $stmt->bindParam(':id_especialidad', $id_especialidad);
        $stmt->bindParam(':telefono', $telefono);
        $stmt->bindParam(':horario', $horario);
        $stmt->bindParam(':id_medico', $id_medico);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar médico: " . $e->getMessage());
    }
}

function getMedicoById($id_medico)
{
    global $pdo;
    try {
        $sql = "SELECT 
                    m.id_medico, 
                    m.nombre_medico, 
                    m.apellido, 
                    e.nombre_especialidad, 
                    m.telefono, 
                    m.horario
                FROM MEDICO m
                LEFT JOIN ESPECIALIDAD e ON m.id_especialidad = e.id_especialidad
                WHERE m.id_medico = :id_medico";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener médico: " . $e->getMessage());
    }
}
// Eliminar un médico
function deleteMedico($id_medico)
{
    global $pdo;
    try {
        $sql = "DELETE FROM MEDICO WHERE id_medico = :id_medico";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_medico', $id_medico);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar médico: " . $e->getMessage());
    }
}

function getMedicosByEspecialidad($id_especialidad)
{
    global $pdo;
    try {
        $sql = "SELECT
                    m.id_medico,
                    m.nombre_medico,
                    m.apellido,
                    e.nombre_especialidad,
                    m.telefono,
                    m.horario
                FROM MEDICO m
                LEFT JOIN ESPECIALIDAD e ON m.id_especialidad = e.id_especialidad
                WHERE m.id_especialidad = :id_especialidad";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_especialidad', $id_especialidad);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener médicos por especialidad: " . $e->getMessage());
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
            if (isset($data['nombre_medico']) && isset($data['apellido']) && isset($data['id_especialidad']) && isset($data['telefono']) && isset($data['horario'])) {
                $result = createMedico($data['nombre_medico'], $data['apellido'], $data['id_especialidad'], $data['telefono'], $data['horario']);
                echo json_encode(['success' => $result]);
            } else {
                echo json_encode(['error' => 'Faltan datos requeridos']);
            }
            break;
        case 'GET':
            if (isset($_GET['id_especialidad'])) {
                $medicos = getMedicosByEspecialidad($_GET['id_especialidad']);
                echo json_encode($medicos);
            } elseif (isset($_GET['id'])) {
                $medico = getMedicoById($_GET['id']);
                echo json_encode($medico);
            } else {
                $medicos = getMedicos();
                echo json_encode($medicos);
            }
            break;
        case 'PUT':
            $data = getJsonInput();
            if (isset($data['id_medico']) && isset($data['nombre_medico']) && isset($data['apellido']) && isset($data['id_especialidad']) && isset($data['telefono']) && isset($data['horario'])) {
                $result = updateMedico($data['id_medico'], $data['nombre_medico'], $data['apellido'], $data['id_especialidad'], $data['telefono'], $data['horario']);
                echo json_encode(['success' => $result]);
            } else {
                echo json_encode(['error' => 'Faltan datos requeridos']);
            }
            break;
        case 'DELETE':
            if (isset($_GET['id'])) {
                $result = deleteMedico($_GET['id']);
                echo json_encode(['success' => $result]);
            } else {
                echo json_encode(['error' => 'ID de médico requerido']);
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