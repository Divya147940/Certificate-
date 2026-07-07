<?php
// api/config.php

// Define database connection parameters. 
// These can be updated dynamically or read from environment if required, 
// but typically for cPanel shared hosting, hardcoding or requiring a specific config is used.
$host = 'localhost';
$db   = 'u759861691_Certificate';
$user = 'u759861691_Certificate';
$pass = 'Certificate@321';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // Return JSON error response if DB connection fails
     header('Content-Type: application/json');
     echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
     exit;
}
?>
