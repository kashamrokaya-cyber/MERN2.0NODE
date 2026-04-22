const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const allowedFileTypes=['image/png','image/jpeg','image/jpg']
        if(!allowedFileTypes.includes(file.mimetype)){
            return
            cb(new Error("This filetype is not supported"))
        }
        cb(null, './storage')//cb(error,success)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

module.exports = {
    multer,
    storage
}