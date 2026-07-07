<?php
// api/get_certificate.php
header('Content-Type: application/json');

require_once 'config.php';

// Check if ID is provided
if (!isset($_GET['id']) || empty(trim($_GET['id']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Certificate ID is required.']);
    exit;
}

$id = strtoupper(trim($_GET['id']));

// Strip common image extensions if the user accidentally included them in the search
$extensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
foreach ($extensions as $ext) {
    if (strripos($id, strtoupper($ext)) === strlen($id) - strlen($ext)) {
        $id = substr($id, 0, -strlen($ext));
        break;
    }
}

try {
    $stmt = $pdo->prepare("SELECT * FROM certificates WHERE UPPER(id) = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();

    if ($row) {
        echo json_encode(['success' => true, 'certificate' => $row]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Certificate ID not found in the registry.']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
