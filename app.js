const express = require('express');
const app = express();
const ConnectionString = require('./database/index')
app.use(express.json());
const Book = require('./Model/bookModel')


ConnectionString();


//Add or Create book
app.post('/book', async (req, res) => {
    // console.log(req.body.bookName);
    // console.log(req.body.authorName);

    const { bookName, authorName, bookPrice, isbnNumber, publishedAt } = req.body;
    await Book.create({
        bookName: bookName,
        authorName: authorName,
        bookPrice: bookPrice,
        isbnNumber: isbnNumber,
        publishedAt: publishedAt
    })
    res.status(200).json({
        message: "Book is successfully created"
    })

})
//fetch single book
app.get('/book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const oneBook = await Book.findById(id);
        if (!oneBook) {
            res.status(404).json({
                message: "no book is avalable"
                
            })


        } else {

            res.status(200).json({
                message: "single book is available",
                data: oneBook
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "something went wrong"
        });
    };
});


//fetch all book
app.get('/', async (req, res) => {

    const Books = await Book.find();
    res.status(200).json({
        message: "Fetched all successfully",
        data: Books
    });
});
//delete book 
app.delete('/book/:id', async (req, res) => {
    const id = req.params.id;
    await Book.findByIdAndDelete(id);
    res.status(200).json({
        message: "successfully deleted"
    });
});

//update books
app.patch('/book/:id', async (req, res) => {
    const id = req.params.id;
    const { bookName, authorName, bookPrice, isbnNumber, publishedAt } = req.body;
    await Book.findByIdAndUpdate(id, {
        bookName: bookName,
        authorName: authorName,
        bookPrice: bookPrice,
        isbnNumber: isbnNumber,
        publishedAt: publishedAt
    });
    res.status(200).json({
        message: "updated successfully..."
    });
});





app.listen(3000, () => {
    console.log("App is listening...")
})

















