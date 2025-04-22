<?php

require_once 'db.php';

function createServicio($nombre_servicio,$descripcion,$costo){
    global $pdo;
    try {
        $sql = "INSERT INTO SERVICIO (nombre_servicio,descripcion,costo) VALUES (:nombre_servicio,:descripcion,:costo)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nombre_servicio', $nombre_servicio);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':costo', $costo);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function deleteServicio($id_servicio){
    global $pdo;
    try {
        $sql = "DELETE FROM SERVICIO WHERE id_servicio = :id_servicio";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_servicio', $id_servicio);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function getServicios(){
    global $pdo;
    try {
        $sql = "SELECT id_servicio,nombre_servicio,descripcion,costo FROM SERVICIO";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}

function editServicio($id_servicio,$nombre_servicio,$descripcion,$costo){
    global $pdo;
    try {
        $sql = "UPDATE SERVICIO SET nombre_servicio = :nombre_servicio, descripcion = :descripcion, costo = :costo WHERE id_servicio = :id_servicio";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id_servicio', $id_servicio);
        $stmt->bindParam(':nombre_servicio', $nombre_servicio);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':costo', $costo);
        return $stmt->execute();
    } catch (PDOException $e) {
        die("Error de conexion: " . $e->getMessage());
    }
}


$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), associative: true);
}

try{

    switch($method){
        case 'GET':
            $servicios = getServicios();
            echo json_encode($servicios);
            break;
        case 'POST':
            $input = getJsonInput();
            if(isset($input['nombre_servicio']) && isset($input['descripcion']) && isset($input['costo'])){
                $nombre_servicio = $input['nombre_servicio'];
                $descripcion = $input['descripcion'];
                $costo = $input['costo'];
                if(createServicio($nombre_servicio,$descripcion,$costo)){
                    http_response_code(200);
                    echo json_encode(["message" => "Servicio creado"]);
                }else{
                    http_response_code(500);
                    echo json_encode(["error" => "Error al crear servicio"]);
                }
            }else{
                http_response_code(400);
                echo json_encode(["error" => "Nombre, descripcion y costo son requeridos"]);
            }
            break;
        case 'DELETE':
            $input = getJsonInput();
            if(isset($input['id_servicio'])){
                $id_servicio = $input['id_servicio'];
                if(deleteServicio($id_servicio)){
                    http_response_code(200);
                    echo json_encode(["message" => "Servicio eliminado"]);
                }else{
                    http_response_code(500);
                    echo json_encode(["error" => "Error al eliminar servicio"]);
                }
            }else{
                http_response_code(400);
                echo json_encode(["error" => "ID de servicio es requerido"]);
            }
            break;
        case 'PUT':
            $input = getJsonInput();
            if(isset($input['id_servicio']) && isset($input['nombre_servicio']) && isset($input['descripcion']) && isset($input['costo'])){
                $id_servicio = $input['id_servicio'];
                $nombre_servicio = $input['nombre_servicio'];
                $descripcion = $input['descripcion'];
                $costo = $input['costo'];
                if(editServicio($id_servicio,$nombre_servicio,$descripcion,$costo)){
                    http_response_code(200);
                    echo json_encode(["message" => "Servicio editado"]);
                }else{
                    http_response_code(500);
                    echo json_encode(["error" => "Error al editar servicio"]);
                }
            }else{
                http_response_code(400);
                echo json_encode(["error" => "ID, nombre, descripcion y costo son requeridos"]);
            }
            break;            
    }

}catch(Exception $e){
    die("Error de conexion: " . $e->getMessage());
}
?>