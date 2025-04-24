<?php
require_once 'db.php';

function createMedico($id_usuario, $id_especialidad, $licencia) {
    global $pdo;
    try {
        $sql = "INSERT INTO MEDICO (id_usuario, id_especialidad, licencia) 
                VALUES (:id_usuario, :id_especialidad, :licencia)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':id_especialidad', $id_especialidad);
        $stmt->bindParam(':licencia', $licencia);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear médico: " . $e->getMessage());
    }
}

function getMedicos() {
    global $pdo;
    try {
        $sql = "SELECT * FROM MEDICO";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener médicos: " . $e->getMessage());
    }
}

function updateMedico($id_medico, $id_especialidad, $licencia) {
    global $pdo;
    try {
        $sql = "UPDATE MEDICO SET id_especialidad = :id_especialidad, licencia = :licencia 
                WHERE id_medico = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_especialidad', $id_especialidad);
        $stmt->bindParam(':licencia', $licencia);
        $stmt->bindParam(':id', $id_medico);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar médico: " . $e->getMessage());
    }
}

function deleteMedico($id_medico) {
    global $pdo;
    try {
        $sql = "DELETE FROM MEDICO WHERE id_medico = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id_medico);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar médico: " . $e->getMessage());
    }
}
?>