<?php
require_once 'db.php';

function createPaciente($id_usuario, $genero, $fecha_nacimiento) {
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

function getPacientes() {
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

function updatePaciente($id_paciente, $genero, $fecha_nacimiento) {
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

function deletePaciente($id_paciente) {
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
?>