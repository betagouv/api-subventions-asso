import express from 'express';

const appName = 'datasubvention';
const port = process.env.PORT || 8080;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`${appName} listening at http://localhost:${port}`);
});
