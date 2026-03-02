<?php
// On démarre la session pour accéder aux infos stockées lors du login
session_start();

header("Content-Type: application/json");
require_once "Database.php";

// Vérification de sécurité : l'utilisateur est-il connecté ?
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Session expirée ou non autorisée."]);
    exit;
}

// Récupération des données envoyées par le JS
$data = json_decode(file_get_contents("php://input"), true);

// --- MODIFICATION SÉCURITÉ ---
// On ignore l'ID venant du JS ($data["id"]) et on utilise celui du SERVEUR
$id = $_SESSION['user_id'];

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