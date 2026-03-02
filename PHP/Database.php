<?php
class Database {
    private $host = "db"; 
    private $dbname = "vite_et_gourmand"; // Correction : doit correspondre au SQL
    private $username = "root";
    private $password = "root_password"; // Correction : doit correspondre au docker-compose

    public function getConnection() {
        try {
            $pdo = new PDO(
                "mysql:host=".$this->host.";dbname=".$this->dbname.";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            return $pdo;
        } catch (PDOException $e) {
            // Petit conseil : en développement Docker, afficher l'erreur aide beaucoup
            die("Erreur de connexion : " . $e->getMessage());
        }
    }
}

// Création automatique de $pdo pour tous les scripts
$db = new Database();
$pdo = $db->getConnection();