<?php
header("Content-Type: application/json");
require_once 'Database.php'; // Ton fichier de connexion BDD

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID manquant"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM menus WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>