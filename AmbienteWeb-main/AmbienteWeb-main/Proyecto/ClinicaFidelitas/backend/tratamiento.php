<?php
require_once 'db.php';

function createTratamiento($nombre, $descripcion) {
    global $pdo;
    try {
        $sql = "INSERT INTO TRATAMIENTO (nombre_tratamiento, descripcion) VALUES (:nombre, :descripcion)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al crear tratamiento: " . $e->getMessage());
    }
}

function getTratamientos() {
    global $pdo;
    try {
        $sql = "SELECT * FROM TRATAMIENTO";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al obtener tratamientos: " . $e->getMessage());
    }
}

function updateTratamiento($id, $nombre, $descripcion) {
    global $pdo;
    try {
        $sql = "UPDATE TRATAMIENTO SET nombre_tratamiento = :nombre, descripcion = :descripcion WHERE id_tratamiento = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al actualizar tratamiento: " . $e->getMessage());
    }
}

function deleteTratamiento($id) {
    global $pdo;
    try {
        $sql = "DELETE FROM TRATAMIENTO WHERE id_tratamiento = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error al eliminar tratamiento: " . $e->getMessage());
    }
}
?>