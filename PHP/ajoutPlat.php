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
