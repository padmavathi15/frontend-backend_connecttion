const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api', routes);
app.get("/",(req,res)=>{
    res.send("Hello");
})
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
