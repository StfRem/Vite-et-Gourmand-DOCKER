<?php
require_once "Database.php";

$input = json_decode(file_get_contents('php://input'), true);
$nom = isset($input['nom']) ? trim($input['nom']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';

if (empty($nom)) {
    echo json_encode(["success" => false, "message" => "Nom requis"]);
    exit;
}

try {
    $id = uniqid('plat_');
    $stmt = $pdo->prepare("INSERT INTO creation_plat (id, nom, description) VALUES (:id, :nom, :description)");
    $stmt->execute([':id' => $id, ':nom' => $nom, ':description' => $description]);
    echo json_encode(["success" => true, "id" => $id]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

?>
