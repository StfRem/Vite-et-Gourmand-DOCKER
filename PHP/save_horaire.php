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

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['jour'], $data['ouverture'], $data['fermeture'])) {
    echo json_encode(["status" => "error", "message" => "Champs manquants"]);
    exit;
}

try {
    // Si ID existe → UPDATE
    if (!empty($data['id'])) {
        $query = $pdo->prepare("
            UPDATE horaires 
            SET jour = :jour, ouverture = :ouverture, fermeture = :fermeture
            WHERE id = :id
        ");
        $query->execute([
            'id' => $data['id'],
            'jour' => $data['jour'],
            'ouverture' => $data['ouverture'],
            'fermeture' => $data['fermeture']
        ]);
    } 
    // Sinon → INSERT
    else {
        $query = $pdo->prepare("
            INSERT INTO horaires (jour, ouverture, fermeture)
            VALUES (:jour, :ouverture, :fermeture)
        ");
        $query->execute([
            'jour' => $data['jour'],
            'ouverture' => $data['ouverture'],
            'fermeture' => $data['fermeture']
        ]);
    }

    echo json_encode(["status" => "success"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
