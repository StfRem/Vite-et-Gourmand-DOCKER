<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

// 1. VÉRIFICATION DE LA SESSION (Harmonisée)
if (!isset($_SESSION['user_role']) || !in_array($_SESSION['user_role'], ['admin', 'employe'])) {
    http_response_code(403); 
    echo json_encode([
        "success" => false,
        "message" => "Accès refusé : session expirée ou privilèges insuffisants."
    ]);
    exit;
}

require_once "Database.php";

// 2. RÉCUPÉRATION DES DONNÉES
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['nom']) || !isset($data['description']) || !isset($data['prix'])) {
    echo json_encode([
        "success" => false,
        "message" => "Données manquantes : nom, description ou prix"
    ]);
    exit;
}

$nom = trim($data['nom']);
$description = trim($data['description']);
$prix = floatval($data['prix']);

// Validation des valeurs
if (empty($nom) || empty($description) || $prix <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Les champs doivent être valides (prix > 0)"
    ]);
    exit;
}

// 3. INSERTION EN BASE DE DONNÉES
try {
    $sql = $pdo->prepare("
        INSERT INTO menus (titre, description, theme, regime, personnesMin, prix, conditions, stock)
        VALUES (?, ?, 'Admin', 'Personnalisé', 1, ?, 'Menu créé par l\'administrateur', 50)
    ");
    
    $result = $sql->execute([$nom, $description, $prix]);
    
    if ($result) {
        $menuId = $pdo->lastInsertId();
        echo json_encode([
            "success" => true,
            "message" => "Menu créé avec succès",
            "id" => $menuId,
            "menu" => [
                "id" => $menuId,
                "titre" => $nom,
                "description" => $description,
                "prix" => $prix,
                "theme" => "Admin",
                "regime" => "Personnalisé"
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Erreur lors de l'insertion en base de données"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur : " . $e->getMessage()
    ]);
}
?>