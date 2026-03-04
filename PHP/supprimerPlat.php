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
$id = isset($input['id']) ? $input['id'] : null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID requis"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM creation_plat WHERE id = :id");
    $stmt->execute([':id' => $id]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

?>
