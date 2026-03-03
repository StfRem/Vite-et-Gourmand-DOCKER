<?php
header("Content-Type: application/json");
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