const express = require('express');

const appName = 'Datasubvention';
const port = process.env.PORT || 8080;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app.listen(port, () => {
    console.log(`${appName} listening at http://localhost:${port}`);
});
