require('dotenv').config();

const mongoose = require('mongoose');

// Set the strictQuery option
mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        // Add database name 'bankManagement' to the URI
        const dbURI = `${process.env.MONGO_URI.replace('/?', '/bankManagement?')}`;
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected to database:', mongoose.connection.db.databaseName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;

