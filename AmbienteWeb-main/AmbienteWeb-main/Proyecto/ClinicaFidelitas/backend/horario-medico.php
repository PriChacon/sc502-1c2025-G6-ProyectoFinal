<?php
require_once 'db.php';

function createHorarioMedico($id_medico, $dia, $hora_inicio, $hora_fin) {
    global $pdo;
    try {
        $sql = "INSERT INTO HORARIO_MEDICO (id_medico, dia, hora_inicio, hora_fin) 
                VALUES (:id_medico, :dia, :hora_inicio, :hora_fin)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->bindParam(':dia', $dia);
        $stmt->bindParam(':hora_inicio', $hora_inicio);
        $stmt->bindParam(':hora_fin', $hora_fin);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear horario: " . $e->getMessage());
    }
}

function getHorariosMedico() {
    global $pdo;
    try {
        $sql = "SELECT * FROM HORARIO_MEDICO";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener horarios: " . $e->getMessage());
    }
}

function updateHorarioMedico($id, $dia, $hora_inicio, $hora_fin) {
    global $pdo;
    try {
        $sql = "UPDATE HORARIO_MEDICO 
                SET dia = :dia, hora_inicio = :hora_inicio, hora_fin = :hora_fin 
                WHERE id_horario = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':dia', $dia);
        $stmt->bindParam(':hora_inicio', $hora_inicio);
        $stmt->bindParam(':hora_fin', $hora_fin);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar horario: " . $e->getMessage());
    }
}

function deleteHorarioMedico($id) {
    global $pdo;
    try {
        $sql = "DELETE FROM HORARIO_MEDICO WHERE id_horario = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar horario: " . $e->getMessage());
    }
}
?>