<?php
require_once "Database.php";

try {
    $stmt = $pdo->query("SELECT * FROM creation_plat");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $data]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}


?>
