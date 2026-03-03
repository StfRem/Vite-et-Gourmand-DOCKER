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

$commandeId = $data["commandeId"];
$userId = $data["userId"];

// 1. Récupérer la commande
$sql = "SELECT * FROM commandes WHERE id = ? AND userId = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$commandeId, $userId]);
$cmd = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$cmd) {
    echo json_encode(["success" => false, "message" => "Commande introuvable"]);
    exit;
}

// 2. Ajouter historique
$historique = json_decode($cmd["historique"], true);
$historique[] = [
    "date" => date("c"),
    "action" => "Commande annulée par l'utilisateur"
];

// 3. Mise à jour SQL
$sqlUpdate = "UPDATE commandes SET statut = 'annulée', historique = ? WHERE id = ? AND userId = ?";
$stmtUpdate = $pdo->prepare($sqlUpdate);
$stmtUpdate->execute([json_encode($historique), $commandeId, $userId]);

echo json_encode(["success" => true]);