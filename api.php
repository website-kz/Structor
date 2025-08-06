<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "username", "password", "structor_db");
if ($conn->connect_error) die(json_encode(['success' => false, 'error' => 'Connection failed']));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['login'])) {
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    $username = $_POST['username'];
    $stmt = $conn->prepare("SELECT id, username FROM users WHERE phone = ? AND password = ?");
    $stmt->bind_param("ss", $phone, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        echo json_encode(['success' => true, 'user' => $row]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['signup'])) {
    $username = $_POST['username'];
    $phone = $_POST['phone'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (username, phone, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $phone, $password);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['projects'])) {
    $userId = $_GET['userId'];
    $result = $conn->query("SELECT * FROM projects WHERE user_id = $userId LIMIT 5");
    $projects = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($projects);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['checkDomain'])) {
    $domain = $_GET['domain'];
    $result = $conn->query("SELECT COUNT(*) as count FROM projects WHERE domain = '$domain'");
    $row = $result->fetch_assoc();
    echo json_encode(['available' => $row['count'] == 0]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['saveProject'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'];
    $domain = $data['domain'];
    $pages = json_encode($data['pages']);
    $stmt = $conn->prepare("INSERT INTO projects (user_id, domain, pages) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE pages = ?");
    $stmt->bind_param("isss", $userId, $domain, $pages, $pages);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
    $stmt->close();
}

$conn->close();
?>