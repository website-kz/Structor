let currentUser = null;
let projects = [];
let pages = {};

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    const form = document.getElementById('loginForm');
    const phone = form.querySelector('input[type="text"]:nth-child(2)').value;
    const password = form.querySelector('input[type="password"]').value;
    const username = form.querySelector('input[type="text"]:nth-child(4)').value;
    // Simulate login with PHP/MySQL
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, username })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            currentUser = data.user;
            loadProjects();
        }
    });
}

function handleSignup(event) {
    event.preventDefault();
    const form = document.getElementById('signupForm');
    const username = form.querySelector('input[type="text"]').value;
    const phone = form.querySelector('input[type="text"]:nth-child(2)').value;
    const password = form.querySelector('input[type="password"]:nth-child(4)').value;
    const confirmPass = form.querySelector('input[type="password"]:nth-child(6)').value;
    if (password !== confirmPass) return alert('Passwords do not match');
    fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, password })
    }).then(response => response.json()).then(data => {
        if (data.success) showSection('projects');
    });
}

function loadProjects() {
    fetch('/api/projects?userId=' + currentUser.id).then(response => response.json()).then(data => {
        projects = data;
        showSection('projects');
    });
}

function addPage(pageName) {
    pages[pageName] = { blocks: [] };
    showSection('pageEditor');
    document.getElementById('pageEditor').querySelector('h3').textContent = pageName;
}

function showBlocksMenu() {
    const container = document.getElementById('blocksContainer');
    container.innerHTML = `
        <div class="block" contenteditable="true">For text</div>
        <div class="block" contenteditable="true">For files & images</div>
        <div class="block" contenteditable="true">For Code (C, C++, Python, PHP, JS, TS, C#)</div>
    `;
    makeResizable(container.querySelectorAll('.block'));
}

function makeResizable(blocks) {
    blocks.forEach(block => {
        block.style.resize = 'both';
        block.style.overflow = 'auto';
    });
}

function showSaveDialog() {
    document.getElementById('saveDialog').classList.remove('hidden');
}

function checkDomain() {
    const domain = document.getElementById('domainInput').value;
    fetch('/api/checkDomain?domain=' + domain).then(response => response.json()).then(data => {
        document.getElementById('domainStatus').textContent = data.available ? '' : 'Domain already taken!';
    });
}

function saveProject() {
    const domain = document.getElementById('domainInput').value;
    fetch('/api/saveProject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, domain, pages })
    }).then(() => {
        document.getElementById('saveDialog').classList.add('hidden');
        loadProjects();
    });
}

function deleteProject() {
    // Implement deletion logic
}

function editProject() {
    // Implement edit logic
}