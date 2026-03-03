<?php
header("Content-Type: application/json; charset=utf-8");
require_once "Database.php";

// Log pour déboguer
error_log("[MENU] Requête POST reçue");

$data = json_decode(file_get_contents("php://input"), true);
error_log("[MENU] Données reçues: " . json_encode($data));

// Vérifier que les données sont reçues
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

// Validation basique
if (empty($nom) || empty($description) || $prix <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Les champs doivent être valides (prix > 0)"
    ]);
    exit;
}

try {
    // Insérer le menu dans la table menus
    // Les 3 menus existants ont les IDs 1, 2, 3 donc les nouveaux auront 4+
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
                "nom" => $nom,
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
    error_log("[MENU] Exception: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Erreur serveur : " . $e->getMessage()
    ]);
}
?>
