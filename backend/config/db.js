const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri,{
    ssl:true
});

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Could not connect to MongoDB", error);
    }
}

module.exports = { client, ObjectId, connectDB };
