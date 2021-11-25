
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const mimeType = {
    "image/jpeg": ".jpeg",
    "image/png": ".png",
    "image/jpg": ".jpg"

}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
        const exten = mimeType[file.mimetype];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + exten)
    }
})
const fileFilter = function (req, file, cb) {
    if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
        return cb(new Error("Must upload png|jped|jpg image"))
    }
    cb(null, true)
}

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    storage: storage,
    fileFilter: fileFilter

})


// all the text field  are in the req.body and the file field are in the req.file 

module.exports = upload;

