const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "profileImage") {
            cb(null, './uploads/profileImages/')
        }
        else if (file.fieldname == "specieImage") {
            cb(null, './uploads/specieImages/')
        }
        else if (file.fieldname == "catchLogImage") {
            cb(null, './uploads/catchlogImages/')
        }
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: async (req, file, cb) => {
        if (!file) {
            cb(null, false);
        }
        else {
            cb(null, true);
        }
    }
});

module.exports = { upload } 
