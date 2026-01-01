const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const readUsers = () => {
    try {
        const data = fs.readFileSync(usersPath);
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Simple mock token: "username|role|timestamp|id"
        const token = `${user.username}|${user.role}|${Date.now()}|${user.id}`;
        res.json({
            success: true,
            user: { id: user.id, username: user.username, role: user.role, name: user.name },
            token: token
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};
