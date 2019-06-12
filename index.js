require('dotenv').config();

const server = require('./api/server.js');
const port = process.env.PORT || 5050;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});