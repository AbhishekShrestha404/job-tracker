import mongoose from 'mongoose';

export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'];

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        company: {
            type: String,
            required: [true, 'Company is required'],
            trim: true,
            maxlength: 100,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true,
            maxlength: 100,
        },
        jobUrl: { type: String, trim: true },
        status: {
            type: String,
            enum: STATUSES,
            default: 'wishlist',
        },
        deadline: { type: Date },
        salaryRange: { type: String, trim: true },
        location: { type: String, trim: true },
        notes: { type: String, maxlength: 2000 },
        position: { type: Number, default: 0 }, // order within a column
    },
    { timestamps: true }
);

// Fast lookup of one user's board, grouped by column
applicationSchema.index({ user: 1, status: 1, position: 1 });

export default mongoose.model('Application', applicationSchema);