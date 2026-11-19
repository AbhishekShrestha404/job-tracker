import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGODB_URI);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});