import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.XATA_API_KEY;

if (apiKey) {
    console.log('API Key is:', apiKey);
} else {
    console.log('API Key is not set');
}
