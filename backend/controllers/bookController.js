const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/books.json');

// Helper to read data
const readData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

exports.getAllBooks = (req, res) => {
    try {
        let books = readData();
        const { search, type } = req.query; // type: 'id', 'title', 'author', 'category'

        if (search) {
            const query = search.toLowerCase();
            books = books.filter(book => {
                if (type === 'id') return book.id.toString() === query;
                if (type === 'title') return book.title.toLowerCase().includes(query);
                if (type === 'author') return book.author.toLowerCase().includes(query);
                if (type === 'category') return (book.category || '').toLowerCase().includes(query);

                // Generic search if no type
                return book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    (book.category || '').toLowerCase().includes(query);
            });
        }

        res.json(books);
    } catch (error) {
        res.status(500).send('Error reading data');
    }
};

exports.addBook = (req, res) => {
    try {
        const books = readData();
        const newBook = req.body;

        // Simple validation
        if (!newBook.title || !newBook.author) {
            return res.status(400).json({ message: 'Title and Author are required' });
        }

        // Generate ID
        newBook.id = Date.now().toString();
        newBook.status = 'Available'; // Default status

        books.push(newBook);
        writeData(books);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).send('Error saving book');
    }
};

exports.issueBook = (req, res) => {
    try {
        const books = readData();
        const bookId = req.params.id;
        const bookIndex = books.findIndex(b => b.id === bookId);

        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (books[bookIndex].status === 'Issued') {
            return res.status(400).json({ message: 'Book already issued' });
        }

        books[bookIndex].status = 'Issued';
        writeData(books);
        res.json(books[bookIndex]);
    } catch (error) {
        res.status(500).send('Error updating book');
    }
};

exports.returnBook = (req, res) => {
    try {
        const books = readData();
        const bookId = req.params.id;
        const bookIndex = books.findIndex(b => b.id === bookId);

        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (books[bookIndex].status === 'Available') {
            return res.status(400).json({ message: 'Book is not issued' });
        }

        books[bookIndex].status = 'Available';
        writeData(books);
        res.json(books[bookIndex]);
    } catch (error) {
        res.status(500).send('Error updating book');
    }
};

exports.deleteBook = (req, res) => {
    console.log('DeleteBook: Request received for ID:', req.params.id);
    try {
        let books = readData();
        const bookId = req.params.id;
        const newBooks = books.filter(b => b.id !== bookId);

        if (books.length === newBooks.length) {
            return res.status(404).json({ message: 'Book not found' });
        }

        writeData(newBooks);
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).send('Error deleting book');
    }
};
