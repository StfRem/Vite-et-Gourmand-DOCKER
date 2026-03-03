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

$sql = $pdo->query("SELECT * FROM users WHERE role = 'employe'");
$employes = $sql->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($employes);
