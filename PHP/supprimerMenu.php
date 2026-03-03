<?php
session_start(); // On réveille le vigile
header("Content-Type: application/json; charset=utf-8");
require_once 'Database.php';

// 1. LE VIGILE : Vérification du rôle
$role = $_SESSION['user_role'] ?? null;

if ($role !== 'admin' && $role !== 'employe') {
    http_response_code(403);
    echo json_encode([
        "success" => false, 
        "message" => "Accès refusé : vous devez être connecté pour supprimer un menu."
    ]);
    exit;
}

// 2. RÉCUPÉRATION DES DONNÉES
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID du menu manquant."]);
    exit;
}

// 3. SÉCURITÉ SUPPLÉMENTAIRE : Empêcher la suppression des menus de base (1, 2, 3)
if (in_array((int)$id, [1, 2, 3])) {
    echo json_encode([
        "success" => false, 
        "message" => "Impossible de supprimer les menus permanents de la carte."
    ]);
    exit;
}

try {
    // 4. ACTION EN BASE DE DONNÉES
    $stmt = $pdo->prepare("DELETE FROM menus WHERE id = ?");
    $result = $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Menu supprimé avec succès."]);
    } else {
        echo json_encode(["success" => false, "message" => "Menu non trouvé ou déjà supprimé."]);
    }

} catch (Exception $e) {
    error_log("[DELETE_MENU] Erreur : " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Erreur serveur lors de la suppression."]);
}
?>