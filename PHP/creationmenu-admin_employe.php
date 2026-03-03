<?php
session_start(); 
header("Content-Type: application/json; charset=utf-8");
require_once "Database.php";

// 1. VÉRIFICATION HARMONISÉE AVEC LOGIN.PHP
// On vérifie si 'user_role' existe dans la session
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'employe'])) {
    http_response_code(403); 
    echo json_encode([
        "success" => false,
        "message" => "Accès non autorisé : privilèges insuffisants (Rôle actuel: " . ($_SESSION['user_role'] ?? 'aucun') . ")"
    ]);
    exit;
}

// ... reste du code (récupération JSON et insertion) ...
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['nom']) || empty($data['description']) || !isset($data['prix'])) {
    echo json_encode(["success" => false, "message" => "Données manquantes"]);
    exit;
}

$nom = trim($data['nom']);
$description = trim($data['description']);
$prix = floatval($data['prix']);

try {
    $sql = $pdo->prepare("
        INSERT INTO menus (titre, description, theme, regime, personnesMin, prix, conditions, stock)
        VALUES (?, ?, 'Admin', 'Personnalisé', 1, ?, 'Menu créé par l\'équipe', 50)
    ");
    
    if ($sql->execute([$nom, $description, $prix])) {
        echo json_encode(["success" => true, "message" => "Menu créé avec succès"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Erreur : " . $e->getMessage()]);
}
?>