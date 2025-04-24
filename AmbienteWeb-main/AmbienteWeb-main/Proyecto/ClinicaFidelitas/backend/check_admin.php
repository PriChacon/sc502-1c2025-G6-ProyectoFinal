<?php
session_start();
header('Content-Type: application/json');

$adminRoleId = 1;

if (isset($_SESSION['user_role_id']) && $_SESSION['user_role_id'] == $adminRoleId) {
    echo json_encode(['isAdmin' => true]);
} else {
    echo json_encode(['isAdmin' => false]);
}
?>