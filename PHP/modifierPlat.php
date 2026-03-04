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

// Accepte JSON dans le corps ou données POST (form-urlencoded)
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    // fallback vers $_POST si json_decode a échoué
    $input = $_POST;
}

$id = isset($input['id']) ? $input['id'] : null;
$nom = isset($input['nom']) ? trim($input['nom']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';

if (!$id || empty($nom)) {
    echo json_encode(["success" => false, "message" => "ID et nom requis"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE creation_plat SET nom = :nom, description = :description WHERE id = :id");
    $stmt->execute([':nom' => $nom, ':description' => $description, ':id' => $id]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

?>
