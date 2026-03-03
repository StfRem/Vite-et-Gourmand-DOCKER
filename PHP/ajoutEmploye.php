<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
// VÉRIFICATION DE LA SESSION
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'employe'])) {
    http_response_code(403); 
    echo json_encode([
        "success" => false,
        "message" => "Accès refusé : session expirée ou privilèges insuffisants."
    ]);
    exit; // <--- C'est ce qui empêche réellement la suppression/création
}
require_once 'Database.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$fullname = $data["fullname"];
$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);

try {
    $sql = $pdo->prepare("INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, 'employe')");
    
    $ok = $sql->execute([$fullname, $email, $password]);

    echo json_encode(["success" => $ok]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}