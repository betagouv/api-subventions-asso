import express from 'express';
import { connectDB } from './shared/MongoConnection';

const appName = 'datasubvention';
const port = process.env.PORT || 8080;

async function main() {
    await connectDB();

    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello World');
    });
    
    app.listen(port, () => {
        console.log(`${appName} listening at http://localhost:${port}`);
    });
}

main();