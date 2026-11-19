export function notFound(req, res) {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
    // Mongoose validation errors (missing field, bad email, etc.)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    // Duplicate key (email already registered)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({ message: `${field} already in use` });
    }

    // Invalid ObjectId, e.g. /applications/abc
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });
}