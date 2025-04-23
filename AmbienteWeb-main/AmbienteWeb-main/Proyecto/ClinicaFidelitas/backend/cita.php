<?php
require_once 'db.php';

function createCita($id_usuario, $id_medico, $id_horario, $fecha, $estado) {
    global $pdo;
    try {
        $sql = "INSERT INTO CITA (id_usuario, id_medico, id_horario, fecha, estado) 
                VALUES (:id_usuario, :id_medico, :id_horario, :fecha, :estado)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->bindParam(':id_horario', $id_horario);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->bindParam(':estado', $estado);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear cita: " . $e->getMessage());
    }
}

function getCitas() {
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

function updateCita($id_cita, $estado) {
    global $pdo;
    try {
        $sql = "UPDATE CITA SET estado = :estado WHERE id_cita = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':estado', $estado);
        $stmt->bindParam(':id', $id_cita);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar cita: " . $e->getMessage());
    }
}

function deleteCita($id_cita) {
    global $pdo;
    try {
        $sql = "DELETE FROM CITA WHERE id_cita = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id_cita);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar cita: " . $e->getMessage());
    }
}
?>