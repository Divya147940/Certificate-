<?php
// api/upload_certificate.php
header('Content-Type: application/json');

require_once 'config.php';

// Read JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (!isset($input['id']) || !isset($input['imageData'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Certificate ID and image data are required.']);
    exit;
}

$id = strtoupper(trim($input['id']));
$imageData = $input['imageData'];

// Decode Base64 Image
if (preg_match('/^data:([A-Za-z-+\/]+);base64,(.+)$/', $imageData, $matches)) {
    $mimeType = $matches[1];
    $base64Data = $matches[2];
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid image format. Must be a valid Base64 data-URL.']);
    exit;
}

$buffer = base64_decode($base64Data);

if ($buffer === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Failed to decode base64 data.']);
    exit;
}

// Extract file extension based on MIME type
$ext = 'png'; // default
if (strpos($mimeType, 'jpeg') !== false || strpos($mimeType, 'jpg') !== false) {
    $ext = 'jpg';
} elseif (strpos($mimeType, 'webp') !== false) {
    $ext = 'webp';
} elseif (strpos($mimeType, 'gif') !== false) {
    $ext = 'gif';
} elseif (strpos($mimeType, 'pdf') !== false) {
    $ext = 'pdf';
}

$fileName = $id . '.' . $ext;
$relativePath = '/uploads/' . $fileName;

// Adjust the absolute path because this script is inside the 'api' directory.
// Go up one level to reach 'uploads' in the root directory.
$uploadDir = __DIR__ . '/../uploads';

// Ensure uploads directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$absolutePath = $uploadDir . '/' . $fileName;

// Save image binary to uploads directory
if (file_put_contents($absolutePath, $buffer) === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save the image file to server disk.']);
    exit;
}

try {
    // Check duplicate ID to determine if we should INSERT or UPDATE
    $checkStmt = $pdo->prepare("SELECT id FROM certificates WHERE UPPER(id) = ?");
    $checkStmt->execute([$id]);
    $exists = $checkStmt->fetch();

    if ($exists) {
        $updateStmt = $pdo->prepare("UPDATE certificates SET image_path = ? WHERE UPPER(id) = ?");
        $updateStmt->execute([$relativePath, $id]);
    } else {
        $insertStmt = $pdo->prepare("INSERT INTO certificates (id, image_path) VALUES (?, ?)");
        $insertStmt->execute([$id, $relativePath]);
    }

    echo json_encode(['success' => true, 'message' => 'Certificate image successfully saved and registered.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
