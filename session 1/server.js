const express = require('express');

const app = express();

const PORT  = 3000;

const people = [
    { name: 'John Doe', age: 30 },
    { name: 'Jane Doe', age: 25 },
]

// Middleware

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    if (req.url === '/test') console.log('')

    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/contact', (req, res) => {
    res.send(`<h1>Contact Page</h1>`);
});

app.post('/test', (req, res) => {
    res.json({
        message: 'Route reached!', 
        data: req.body 
    })
})

app.post('/people', (req, res) => {
    const { name, age } = req.body;
    people.push({ name, age });
    
});

app.get('/people', (req, res) => {
    res.json(people);
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});