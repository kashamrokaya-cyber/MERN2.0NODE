


const mongoose = require('mongoose')

// const Connection="mongodb://localhost:27017/book"
const Connection = "mongodb+srv://kashamrokaya18_db_user:kashamrokaya@nodejs20.kkpxhax.mongodb.net/?appName=nodejs20"


async function ConnectionString() {
    await mongoose.connect(Connection);
    console.log("Connected To Db successfully...")
}

module.exports = ConnectionString;