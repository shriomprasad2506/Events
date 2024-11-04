const express = require('express');
const { connectDB } = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL;

app.use(cors())

app.use(express.json());
app.use(`${baseUrl}/events`, eventRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running.`);
});
