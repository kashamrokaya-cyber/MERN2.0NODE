const express = require('express');
const app = express();
const fs = require('fs');
const ConnectionString = require('./database/index')
app.use(express.json());
const Book = require('./Model/bookModel')
const path = require('path')
const { multer, storage } = require('./middleware/multerConfig')
const upload = multer({ storage: storage })
const cors = require('cors');


app.use(cors({
    origin: '*'
}))
ConnectionString();

//fetch all book
app.get('/books', async (req, res) => {

    const Books = await Book.find();
    res.status(200).json({
        message: "Fetched all successfully",
        data: Books
    });
});
//Add or Create book
app.post('/book', upload.single('image'), async (req, res) => {
    // try {

    let filename;
   
    if (!req.file) {
        filename = "https://i.pinimg.com/236x/48/99/c9/4899c9300c2630102f0e13c7b25a657d.jpg"
    } else {
        filename = "http://localhost:3000/" + req.file.filename;
        
    }
        const { bookName, authorName, bookPrice, isbnNumber, publishedAt } = req.body;
        await Book.create({
            bookName: bookName,
            authorName: authorName,
            bookPrice: bookPrice,
            isbnNumber: isbnNumber,
            publishedAt: publishedAt,
            image: filename
        })
        res.status(201).json({
            message: "Book is successfully created"
        })
    // } catch (error) {
    //     console.log(error);
        
    //     if (req.file) {
    //         const filePath = path.join("storage", req.file.filename)
    //         if (fs.existsSync(filePath)) {
    //             fs.unlinkSync(filePath);
    //         }
    //     }
    //     res.status(400).json({
    //         message: error.message
    //     })
    

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



//delete book 
app.delete('/book/:id', async (req, res) => {
    const id = req.params.id;

    const image = await Book.findById(id)
    const imageName = image.image

    const imageUrl = "http://localhost:3000/".length
    const newImageName = imageName.slice(imageUrl)

    fs.unlink('storage/' + newImageName, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Image is removed from storage folder..")
        }
    })
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

        const oldImagePath = oldDatas.image;

        const localHostUrlLength = "http://localhost:3000/".length
        const newOldImagePath = oldImagePath.slice(localHostUrlLength);


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
        image: filename
    });
    res.status(200).json({
        message: "updated successfully..."
    });
});




app.use(express.static("./storage/"))
app.listen(3000, () => {
    console.log("App is listening...", 3000)
})

















