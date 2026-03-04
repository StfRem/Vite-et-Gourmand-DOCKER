<?php
require_once "Database.php";
session_start();

if (!isset($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['admin', 'employe'])) {
    http_response_code(403);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $desc = $_POST['description'];

    try {
        // Mise à jour uniquement pour la gestion indépendante
        $query = "UPDATE plats SET nom = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$desc, $id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}