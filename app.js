const express = require('express');
const app = express();
const fs = require('fs');
const ConnectionString = require('./database/index')
app.use(express.json());
const Book = require('./Model/bookModel')
const { multer, storage } = require('./middleware/multerConfig')
const upload = multer({ storage: storage })

ConnectionString();


//Add or Create book
app.post('/book', upload.single('image'), async (req, res) => {
    // console.log(req.body.bookName);
    // console.log(req.body.authorName);

    const { bookName, authorName, bookPrice, isbnNumber, publishedAt } = req.body;
    let filename;
    // const { mimetype } = req.file;//extension validation

    if (!req.file) {
        filename = "https://i.pinimg.com/236x/05/78/16/05781612d2cbadf5e423cd0cef59b4f1.jpg"
    } else {
        filename = "http://localhost:3000/" + req.file.filename;
    }
    await Book.create({
        bookName: bookName,
        authorName: authorName,
        bookPrice: bookPrice,
        isbnNumber: isbnNumber,
        publishedAt: publishedAt,
        image: filename
    })
    res.status(200).json({
        message: "Book is successfully created"
    })

    res.status(404).json({
        message: "file type is not matched"
    })



})
//fetch single book
app.get('/book/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const oneBook = await Book.findById(id);
        if (!oneBook) {
            return res.status(404).json({
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
app.patch('/book/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;

    const { bookName, authorName, bookPrice, isbnNumber, publishedAt } = req.body;
    const oldDatas = await Book.findById(id)
    let filename;
    if (req.file) {
        console.log(req.file);
        const oldImagePath = oldDatas.image;
        console.log(oldImagePath);
        const localHostUrlLength = "http://localhost:3000/".length
        const newOldImagePath = oldImagePath.slice(localHostUrlLength);
        console.log(newOldImagePath);

        fs.unlink('storage/' + newOldImagePath, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("file is deleted")
            }
        })
        filename = 'http://localhost:3000/' + req.file.filename;
    }
    await Book.findByIdAndUpdate(id, {
        bookName: bookName,
        authorName: authorName,
        bookPrice: bookPrice,
        isbnNumber: isbnNumber,
        publishedAt: publishedAt,
        image:filename
    });
    res.status(200).json({
        message: "updated successfully..."
    });
});




app.use(express.static("./storage/"))
app.listen(3000, () => {
    console.log("App is listening...")
})

















