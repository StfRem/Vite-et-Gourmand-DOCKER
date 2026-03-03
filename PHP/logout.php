<?php
session_start();

// 1. On vide toutes les variables de session
$_SESSION = array();

// 2. On détruit le cookie de session de manière agressive
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. On détruit la session sur le serveur
session_destroy();

header("Content-Type: application/json");
echo json_encode(["success" => true]);
exit;