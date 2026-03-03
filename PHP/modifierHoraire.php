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

$id = $data["id"];
$jour = $data["jour"];
$ouverture = $data["ouverture"];
$fermeture = $data["fermeture"];

try {
    $stmt = $pdo->prepare("UPDATE horaires SET jour = ?, ouverture = ?, fermeture = ? WHERE id = ?");
    $ok = $stmt->execute([$jour, $ouverture, $fermeture, $id]);

    echo json_encode(["success" => $ok]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}