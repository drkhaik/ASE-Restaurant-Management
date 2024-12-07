const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Để xử lý JSON

app.get('/', (req, res) => {
    res.send('Hello from Node.js backend!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});