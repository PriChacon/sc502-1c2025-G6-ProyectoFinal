<?php
require_once 'db.php';

function createCita($id_paciente, $id_medico, $id_servicio, $fecha_cita, $hora_cita, $motivo_cita)
{
    global $pdo;
    try {
        $sql = "INSERT INTO CITA (id_paciente, id_medico, id_servicio, fecha_cita, hora_cita, motivo_cita)
                VALUES (:id_paciente, :id_medico, :id_servicio, :fecha_cita, :hora_cita, :motivo_cita)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_paciente', $id_paciente);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->bindParam(':id_servicio', $id_servicio);
        $stmt->bindParam(':fecha_cita', $fecha_cita);
        $stmt->bindParam(':hora_cita', $hora_cita);
        $stmt->bindParam(':motivo_cita', $motivo_cita);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear cita: " . $e->getMessage());
    }
}

function getCitas()
{
    global $pdo;
    try {
        $sql = "SELECT * FROM CITA";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener citas: " . $e->getMessage());
    }
}

function getCitaById($id_cita)
{
    global $pdo;
    try {
        $sql = "SELECT * FROM CITA WHERE id_cita = :id_cita";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_cita', $id_cita);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener cita: " . $e->getMessage());
    }
}

function updateCita($id_cita, $id_paciente, $id_medico, $id_servicio, $fecha_cita, $hora_cita, $motivo_cita)
{
    global $pdo;
    try {
        $sql = "UPDATE CITA 
                SET id_paciente = :id_paciente, 
                    id_medico = :id_medico, 
                    id_servicio = :id_servicio, 
                    fecha_cita = :fecha_cita, 
                    hora_cita = :hora_cita, 
                    motivo_cita = :motivo_cita
                WHERE id_cita = :id_cita";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_paciente', $id_paciente);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->bindParam(':id_servicio', $id_servicio);
        $stmt->bindParam(':fecha_cita', $fecha_cita);
        $stmt->bindParam(':hora_cita', $hora_cita);
        $stmt->bindParam(':motivo_cita', $motivo_cita);
        $stmt->bindParam(':id_cita', $id_cita);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar la cita: " . $e->getMessage());
    }
}


function deleteCita($id_cita)
{
    global $pdo;
    try {
        $sql = "DELETE FROM CITA WHERE id_cita = :id_cita";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_cita', $id_cita);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar cita: " . $e->getMessage());
    }
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput() {
    $json = file_get_contents('php://input');
    return json_decode($json, true);
}

session_start();
try {
    switch ($method) {
        case 'POST':
            $data = getJsonInput();
            if (isset($data['id_paciente'], $data['id_medico'], $data['id_servicio'], $data['fecha_cita'], $data['hora_cita'], $data['motivo_cita'])) {
                $result = createCita($data['id_paciente'], $data['id_medico'], $data['id_servicio'], $data['fecha_cita'], $data['hora_cita'], $data['motivo_cita']);
                echo json_encode(['success' => $result]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
            }
            break;
        case 'GET':
            if (isset($_GET['id_cita'])) {
                $cita = getCitaById($_GET['id_cita']);
                if ($cita) {
                    echo json_encode($cita);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Cita no encontrada']);
                }
            } else {
                $citas = getCitas();
                echo json_encode($citas);
            }
            break;
        case 'PUT':
            $data = getJsonInput();
            if (isset($data['id_cita'], $data['id_paciente'], $data['id_medico'], $data['id_servicio'], $data['fecha_cita'], $data['hora_cita'], $data['motivo_cita'])) {
                $result = updateCita($data['id_cita'], $data['id_paciente'], $data['id_medico'], $data['id_servicio'], $data['fecha_cita'], $data['hora_cita'], $data['motivo_cita']);
                echo json_encode(['success' => $result]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Datos incompletos']);
            }
            break;
        case 'DELETE':
            if (isset($_GET['id_cita'])) {
                $result = deleteCita($_GET['id_cita']);
                echo json_encode(['success' => $result]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID de cita no proporcionado']);
            }
            break;
        default:
            echo json_encode(['error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor: " . $e->getMessage()]);
    exit;
}
?>