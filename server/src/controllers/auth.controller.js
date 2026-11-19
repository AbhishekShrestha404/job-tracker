import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sendAuthResponse = (res, statusCode, user) => {
    res.status(statusCode).json({
        token: signToken(user._id),
        user: { id: user._id, name: user.name, email: user.email },
    });
};

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        sendAuthResponse(res, 201, user);
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // password has select:false, so ask for it explicitly
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            // same message for both cases, so attackers can't tell which emails exist
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        sendAuthResponse(res, 200, user);
    } catch (err) {
        next(err);
    }
}

export function getMe(req, res) {
    const { _id, name, email } = req.user;
    res.json({ user: { id: _id, name, email } });
}