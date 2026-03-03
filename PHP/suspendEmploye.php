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

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode(["success" => false, "message" => "ID manquant"]);
    exit;
}

$id = $data["id"];

try {
    // On récupère l'état actuel
    $stmt = $pdo->prepare("SELECT suspendu FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "Employé introuvable"]);
        exit;
    }

    // On inverse le statut
    $nouvelEtat = $user["suspendu"] ? 0 : 1;

    $update = $pdo->prepare("UPDATE users SET suspendu = ? WHERE id = ?");
    $ok = $update->execute([$nouvelEtat, $id]);

    echo json_encode(["success" => $ok, "suspendu" => $nouvelEtat]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
