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

try {
    $query = $pdo->query("SELECT * FROM horaires ORDER BY FIELD(jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')");
    $horaires = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $horaires]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>