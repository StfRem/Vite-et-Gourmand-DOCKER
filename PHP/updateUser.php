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

// Récupération des données envoyées par le JS
$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$fullname = $data["fullname"];
$gsm = $data["gsm"];
$adresse = $data["adresse"];
$cp = $data["cp"];
$ville = $data["ville"];

$sql = "UPDATE users 
        SET fullname = ?, gsm = ?, adresse = ?, cp = ?, ville = ?
        WHERE id = ?";

$stmt = $pdo->prepare($sql);
$ok = $stmt->execute([$fullname, $gsm, $adresse, $cp, $ville, $id]);

echo json_encode(["success" => $ok]);
