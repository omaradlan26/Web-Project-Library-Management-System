const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function login(username, password) {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, { username, password });
        return res.data.token;
    } catch (error) {
        console.error(`Login failed for ${username}:`, error.response?.data || error.message);
        return null;
    }
}

async function addBook(token, title) {
    try {
        await axios.post(`${BASE_URL}/books`, {
            title, author: 'Tester', ISBN: '123' + Math.floor(Math.random() * 1000)
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true };
    } catch (error) {
        return { success: false, status: error.response?.status, message: error.response?.data?.message };
    }
}

async function runTests() {
    console.log('--- Starting Role Verification ---');

    console.log('\nPlease ensure the backend is running on port 5000!');

    // 1. Admin
    const adminToken = await login('admin', 'admin123');
    if (adminToken) {
        const res = await addBook(adminToken, 'Admin Book');
        console.log(`Admin Add Book: ${res.success ? 'PASSED' : 'FAILED'} (Expected: Success)`);
    }

    // 2. Manager
    const managerToken = await login('manager', 'manager123');
    if (managerToken) {
        const res = await addBook(managerToken, 'Manager Book');
        console.log(`Manager Add Book: ${res.success ? 'PASSED' : 'FAILED'} (Expected: Success)`);
    }

    // 3. Customer
    const customerToken = await login('aliahmed', '123');
    if (customerToken) {
        const res = await addBook(customerToken, 'Customer Book');
        if (!res.success && res.status === 403) {
            console.log(`Customer Add Book: PASSED (Expected: 403 Forbidden)`);
        } else {
            console.log(`Customer Add Book: FAILED (Got: ${res.status}, Expected: 403)`);
        }
    }
}

runTests();
