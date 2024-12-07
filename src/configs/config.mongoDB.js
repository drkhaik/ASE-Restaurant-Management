require('dotenv').config();
const mongoose = require('mongoose');

const connectToDatabase = () => {
    return new Promise((resolve, reject) => {
        let databaseURI = process.env.DATABASE_URI;
        if (process.env.NODE_ENV === 'production') {
            // Use production database URI
            databaseURI = process.env.PRODUCTION_DATABASE_URI;
        }
        mongoose.connect(databaseURI);

        mongoose.connection.on("error", (err) => {
            console.log("Connect to DB fail", err.message);
            reject(err);
        });

        mongoose.connection.once("open", () => {
            console.log("Connect to DB success");
            resolve();
        });
    })
};

module.exports = connectToDatabase;