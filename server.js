const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let comments = [];

if (fs.existsSync('comments.json')) {
    comments = JSON.parse(fs.readFileSync('comments.json'));
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/comments', (req, res) => {
    res.json(comments);
});

app.post('/comments', (req, res) => {
    const comment = req.body.comment;
    comments.push(comment);
    fs.writeFileSync('comments.json', JSON.stringify(comments));
    res.json({ success: true, comment });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Reflected XSS via URL parameter
app.get('/reflected', (req, res) => {
    const userInput = req.query.input;
    res.send(`<h1>Reflected XSS Example</h1><p>${userInput}</p>`);
});