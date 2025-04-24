<?php
require 'db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido", 405);
    }

    // Verificar campos recibidos
    $required = ['nombre', 'email', 'mensaje'];
    foreach ($required as $campo) {
        if (!isset($_POST[$campo]) || empty($_POST[$campo])) {
            throw new Exception("Campo requerido: $campo", 400);
        }
    }

    // Insertar en BD
    $stmt = $pdo->prepare("INSERT INTO contacto (nombre, email, mensaje) VALUES (?, ?, ?)");
    $stmt->execute([
        $_POST['nombre'],
        $_POST['email'],
        $_POST['mensaje']
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Mensaje guardado exitosamente. ID: ' . $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log('Error BD: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de base de datos: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code($e->getCode());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

?>