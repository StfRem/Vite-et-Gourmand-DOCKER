<?php
session_start();
session_unset();    // Supprime les variables de session
session_destroy();  // Détruit la session sur le serveur

header("Content-Type: application/json");
echo json_encode(["success" => true, "message" => "Déconnexion réussie"]);
exit;
?>