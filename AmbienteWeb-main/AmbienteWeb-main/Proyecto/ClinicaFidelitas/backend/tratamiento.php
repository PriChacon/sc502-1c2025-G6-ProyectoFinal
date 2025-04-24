<?php
require_once 'db.php';

// Crear un tratamiento
function createTratamiento($id_paciente, $id_servicio, $descripcion, $fecha_inicio, $fecha_fin) {
    global $pdo;
    try {
        $sql = "INSERT INTO TRATAMIENTO (id_paciente, id_servicio, descripcion, fecha_inicio, fecha_fin) 
                VALUES (:id_paciente, :id_servicio, :descripcion, :fecha_inicio, :fecha_fin)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_paciente', $id_paciente);
        $stmt->bindParam(':id_servicio', $id_servicio);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_fin', $fecha_fin);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear tratamiento: " . $e->getMessage());
    }
}


// Obtener todos los tratamientos
function getTratamientos() {
    global $pdo;
    try {
        $sql = "SELECT t.id_tratamiento, p.nombre_paciente AS paciente_nombre, p.apellido_paciente AS paciente_apellido, s.nombre_servicio AS servicio_nombre, t.descripcion, t.fecha_inicio, t.fecha_fin
                FROM TRATAMIENTO t
                JOIN PACIENTE p ON t.id_paciente = p.id_paciente
                JOIN SERVICIO s ON t.id_servicio = s.id_servicio";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener tratamientos: " . $e->getMessage());
    }
}


// Actualizar un tratamiento
function updateTratamiento($id_tratamiento, $id_paciente, $id_servicio, $descripcion, $fecha_inicio, $fecha_fin) {
    global $pdo;
    try {
        $sql = "UPDATE TRATAMIENTO 
                SET id_paciente = :id_paciente, id_servicio = :id_servicio, descripcion = :descripcion, 
                    fecha_inicio = :fecha_inicio, fecha_fin = :fecha_fin 
                WHERE id_tratamiento = :id_tratamiento";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_paciente', $id_paciente);
        $stmt->bindParam(':id_servicio', $id_servicio);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':fecha_inicio', $fecha_inicio);
        $stmt->bindParam(':fecha_fin', $fecha_fin);
        $stmt->bindParam(':id_tratamiento', $id_tratamiento);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar tratamiento: " . $e->getMessage());
    }
}

function deleteTratamiento($id_tratamiento) {
    global $pdo;
    try {
        $sql = "DELETE FROM TRATAMIENTO WHERE id_tratamiento = :id_tratamiento";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_tratamiento', $id_tratamiento);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar tratamiento: " . $e->getMessage());
    }
}

function getTratamientoById($id_tratamiento) {
    global $pdo;
    try {
        $sql = "SELECT * FROM TRATAMIENTO WHERE id_tratamiento = :id_tratamiento";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_tratamiento', $id_tratamiento);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener tratamiento: " . $e->getMessage());
    }
}


$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput() {
    $json = file_get_contents('php://input');
    return json_decode($json, true);
}

try {
    switch ($method) {
        case 'POST':
            $data = getJsonInput();
            if (isset($data['id_paciente'], $data['id_servicio'], $data['descripcion'], $data['fecha_inicio'], $data['fecha_fin'])) {
                createTratamiento($data['id_paciente'], $data['id_servicio'], $data['descripcion'], $data['fecha_inicio'], $data['fecha_fin']);
                echo json_encode(['message' => 'Tratamiento creado exitosamente']);
            } else {
                echo json_encode(['error' => 'Datos incompletos']);
            }
            break;
        case 'GET':
            if (isset($_GET['id_tratamiento'])) {
                $tratamiento = getTratamientoById($_GET['id_tratamiento']);
                echo json_encode($tratamiento);
            } else {
                $tratamientos = getTratamientos();
                echo json_encode($tratamientos);
            }
            break;
        case 'PUT':
            $data = getJsonInput();
            if (isset($data['id_tratamiento'], $data['id_paciente'], $data['id_servicio'], $data['descripcion'], $data['fecha_inicio'], $data['fecha_fin'])) {
                updateTratamiento($data['id_tratamiento'], $data['id_paciente'], $data['id_servicio'], $data['descripcion'], $data['fecha_inicio'], $data['fecha_fin']);
                echo json_encode(['message' => 'Tratamiento actualizado exitosamente']);
            } else {
                echo json_encode(['error' => 'Datos incompletos']);
            }
            break;
        case 'DELETE':
            if (isset($_GET['id_tratamiento'])) {
                deleteTratamiento($_GET['id_tratamiento']);
                echo json_encode(['message' => 'Tratamiento eliminado exitosamente']);
            } else {
                echo json_encode(['error' => 'ID de tratamiento no proporcionado']);
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