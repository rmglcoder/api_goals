require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const goalRoutes = require('./routes/goalRoutes');

const app = express();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

connectDB();
const PORT = 5000;

app.use(express.json());

app.use('/api/goals', goalRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})