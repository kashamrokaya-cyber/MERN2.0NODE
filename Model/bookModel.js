const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema({
    bookName: {
        type: String,
        unique: true
    },
    bookPrice: {
        type: String
    },
    isbnNumber: {
        type: Number
    },
    authorName: {
        type: String
    },
    publishedAt: {
        type: String
    }
})


const Book = mongoose.model("Book", bookSchema);
module.exports = Book;