// Import the required modules
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST create a new user
app.post('/sentinel', (req, res) => {
    const {
        guidelines = [],
        clincals = [],
        case_uid,
        user_uid,
        enterprise_uid,
        services = []
    } = req.body;
    
    // some call to the sentinel service layer

    res.status(201).json({ status: 'SUCCESS' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});