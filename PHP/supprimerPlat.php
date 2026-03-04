<?php
require_once "Database.php";

$input = json_decode(file_get_contents('php://input'), true);
$id = isset($input['id']) ? $input['id'] : null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID requis"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM creation_plat WHERE id = :id");
    $stmt->execute([':id' => $id]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

?>
