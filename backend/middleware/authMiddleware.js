exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('VerifyToken: Header:', authHeader);
    if (!authHeader) {
        console.log('VerifyToken: Missing header');
        return res.status(403).json({ message: 'No token provided' });
    }

    // Format: "Bearer token" -> split to get token
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('VerifyToken: Malformed token');
        return res.status(403).json({ message: 'Malformed token' });
    }

    // Mock verification: check if it has 3 or 4 parts
    const parts = token.split('|');
    if (parts.length < 3) {
        console.log('VerifyToken: Invalid parts:', parts);
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
        username: parts[0],
        role: parts[1],
        id: parts[3] || null
    };
    console.log('VerifyToken: User verified:', req.user);
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};
