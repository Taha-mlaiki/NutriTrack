
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


app.all('*', (req, res) => {
    res.json({ message: 'heloooo' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});