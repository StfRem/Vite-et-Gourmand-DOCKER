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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['titre'], $data['description'], $data['prix'])) {
    echo json_encode(["success" => false, "message" => "Données incomplètes"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE menus SET titre = ?, description = ?, prix = ? WHERE id = ?");
    $stmt->execute([$data['titre'], $data['description'], $data['prix'], $data['id']]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>