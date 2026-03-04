<?php
require_once "Database.php";
session_start();

// VERIFICATION : Admin ou Employé uniquement
if (!isset($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['admin', 'employe'])) {
    http_response_code(403);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // On récupère les données envoyées par ton JS
    $id_custom = $_POST['id']; // Ton ID type PLAT-177...
    $nom = $_POST['nom'];      // "entrée", "Plat", etc.
    $desc = $_POST['description']; // "Verrine de saumon"

    try {
        // On utilise la table plats, mais on l'adapte à ta demande d'indépendance
        // Si le menu_id n'est pas encore défini, on met 0 ou NULL
        $query = "INSERT INTO plats (nom, allergenes, menu_id) VALUES (?, ?, 0)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$nom . " : " . $desc, ""]); 

        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}