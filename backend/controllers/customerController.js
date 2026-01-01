const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const readUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(usersPath));
    } catch (err) { return []; }
};

const writeUsers = (data) => {
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
};

exports.getAllCustomers = (req, res) => {
    try {
        const users = readUsers();
        const customers = users.filter(u => u.role === 'customer');
        res.json(customers);
    } catch (e) { res.status(500).send('Error'); }
};

exports.addCustomer = (req, res) => {
    try {
        const users = readUsers();
        const { username, password, name, email } = req.body;

        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'Username exists' });
        }

        const newUser = {
            id: Date.now().toString(),
            username,
            password,
            name,
            email,
            role: 'customer'
        };

        users.push(newUser);
        writeUsers(users);
        res.status(201).json(newUser);
    } catch (e) { res.status(500).send('Error saving customer'); }
};

exports.deleteCustomer = (req, res) => {
    try {
        let users = readUsers();
        const id = req.params.id;
        users = users.filter(u => u.id !== id);
        writeUsers(users);
        res.json({ message: 'Customer removed' });
    } catch (e) { res.status(500).send('Error deleting customer'); }
};
