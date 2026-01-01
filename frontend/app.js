const API_URL = 'http://localhost:5001/api/books';

const addBookForm = document.getElementById('addBookForm');
const bookList = document.getElementById('bookList');

// Auth Check
const token = localStorage.getItem('library_token');
const userStr = localStorage.getItem('library_user');
if (!token || !userStr) {
    window.location.href = 'login.html';
}
const user = JSON.parse(userStr || '{}');

// Display User & Role Logic
document.getElementById('userDisplay').textContent = `User: ${user.username} (${user.role})`;

// Show nav for everyone
document.getElementById('adminNav').style.display = 'block';

if (user.role === 'admin') {
    // Admin specific UI tweaks if any
} else {
    // Customer
}

function showSection(section) {
    if (section === 'books') {
        document.getElementById('booksSection').style.display = 'block';
        document.getElementById('customersSection').style.display = 'none';
        fetchBooks();
    } else {
        document.getElementById('booksSection').style.display = 'none';
        document.getElementById('customersSection').style.display = 'block';
        fetchCustomers();
    }
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ... Logout ...

// Fetch Books with Search
async function fetchBooks() {
    const searchType = document.getElementById('searchType').value;
    const searchText = document.getElementById('searchInput').value;

    let url = API_URL; // http://localhost:5001/api/books
    if (searchText) {
        url += `?search=${encodeURIComponent(searchText)}&type=${searchType}`;
    }

    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.status === 401 || response.status === 403) logout();

        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Render books to table
function renderBooks(books) {
    bookList.innerHTML = '';
    books.forEach(book => {
        const tr = document.createElement('tr');

        const statusBadge = book.status === 'Issued'
            ? '<span class="status-issued">Issued</span>'
            : '<span class="status-available">Available</span>';

        let actionBtn = '';
        let deleteBtn = '';

        // Actions based on role
        if (user.role === 'admin' || user.role === 'customer') {
            // Admin & Customer: All actions
            actionBtn = book.status === 'Issued'
                ? `<button class="btn btn-sm btn-warning" onclick="returnBook('${book.id}')">Return</button>`
                : `<button class="btn btn-sm btn-success" onclick="issueBook('${book.id}')">Issue</button>`;
            deleteBtn = `<button class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Delete</button>`;
        }

        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${statusBadge}</td>
            <td class="actions">
                ${actionBtn}
                ${deleteBtn}
            </td>
        `;
        bookList.appendChild(tr);
    });
}

// Add new book
// Add new book
if (addBookForm) {
    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ title, author })
            });

            if (response.ok) {
                document.getElementById('title').value = '';
                document.getElementById('author').value = '';
                fetchBooks();
            } else {
                alert('Failed to add book');
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    });
}

// Issue book
window.issueBook = async (id) => {
    try {
        const response = await fetch(`${API_URL}/issue/${id}`, {
            method: 'PUT',
            headers: getHeaders()
        });
        if (response.ok) {
            fetchBooks();
        } else {
            alert('Failed to issue book');
        }
    } catch (error) {
        console.error('Error issuing book:', error);
    }
};

// Return book
window.returnBook = async (id) => {
    try {
        const response = await fetch(`${API_URL}/return/${id}`, {
            method: 'PUT',
            headers: getHeaders()
        });
        if (response.ok) {
            fetchBooks();
        } else {
            alert('Failed to return book');
        }
    } catch (error) {
        console.error('Error returning book:', error);
    }
};

// Delete book
window.deleteBook = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (response.ok) {
            fetchBooks();
        } else {
            alert('Failed to delete book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
};

// Initial load
fetchBooks();

// Customer Management
async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:5001/api/customers', { headers: getHeaders() });
        const customers = await response.json();
        const list = document.getElementById('customerList');
        list.innerHTML = '';
        customers.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${c.name}</td><td>${c.username}</td><td>${c.id}</td>
                <td><button class="btn btn-sm btn-danger" onclick="deleteCustomer('${c.id}')">Delete</button></td>`;
            list.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

const addCustForm = document.getElementById('addCustomerForm');
if (addCustForm) {
    addCustForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('c_username').value;
        const password = document.getElementById('c_password').value;
        const name = document.getElementById('c_name').value;

        try {
            await fetch('http://localhost:5001/api/customers', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ username, password, name, email: '' })
            });
            addCustForm.reset();
            fetchCustomers();
        } catch (e) { alert('Error adding customer'); }
    });
}

window.deleteCustomer = async (id) => {
    if (!confirm('Delete customer?')) return;
    await fetch(`http://localhost:5001/api/customers/${id}`, { method: 'DELETE', headers: getHeaders() });
    fetchCustomers();
};
// Make functions global for HTML onclick access
window.fetchBooks = fetchBooks;
window.fetchCustomers = fetchCustomers;
window.showSection = showSection;
window.logout = () => {
    localStorage.removeItem('library_token');
    localStorage.removeItem('library_user');
    window.location.href = 'login.html';
};

// Global listener for logout
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtns = document.querySelectorAll('button');
    logoutBtns.forEach(btn => {
        if (btn.textContent.trim() === 'Logout') {
            btn.onclick = logout;
        }
    });
});
