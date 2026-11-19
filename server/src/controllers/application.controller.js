import Application, { STATUSES } from '../models/Application.js';

// Only these fields can be set from the request body.
// This stops clients from setting `user`, `_id`, etc.
const ALLOWED_FIELDS = [
    'company',
    'role',
    'jobUrl',
    'status',
    'deadline',
    'salaryRange',
    'location',
    'notes',
];

const pick = (obj, keys) =>
    Object.fromEntries(
        keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]])
    );

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function getApplications(req, res, next) {
    try {
        const { status, search } = req.query;
        const filter = { user: req.user._id };

        if (status) {
            if (!STATUSES.includes(status)) {
                return res.status(400).json({ message: 'Invalid status filter' });
            }
            filter.status = status;
        }

        if (search) {
            const rx = new RegExp(escapeRegex(search), 'i');
            filter.$or = [{ company: rx }, { role: rx }];
        }

        const applications = await Application.find(filter).sort({
            position: 1,
            createdAt: -1,
        });

        res.json({ count: applications.length, applications });
    } catch (err) {
        next(err);
    }
}

export async function getApplication(req, res, next) {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ application });
    } catch (err) {
        next(err);
    }
}

export async function createApplication(req, res, next) {
    try {
        const data = pick(req.body, ALLOWED_FIELDS);

        // Put the new card at the bottom of its column
        const position = await Application.countDocuments({
            user: req.user._id,
            status: data.status || 'wishlist',
        });

        const application = await Application.create({
            ...data,
            user: req.user._id,
            position,
        });

        res.status(201).json({ application });
    } catch (err) {
        next(err);
    }
}

export async function updateApplication(req, res, next) {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const data = pick(req.body, ALLOWED_FIELDS);

        // Moving to another column: place it at the bottom of that column
        if (data.status && data.status !== application.status) {
            data.position = await Application.countDocuments({
                user: req.user._id,
                status: data.status,
            });
        }

        application.set(data);
        await application.save(); // runs schema validation

        res.json({ application });
    } catch (err) {
        next(err);
    }
}

export async function deleteApplication(req, res, next) {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application deleted' });
    } catch (err) {
        next(err);
    }
}