const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Deepthough_Event', // Folder name in Cloudinary
        allowedFormats: ['jpg', 'png', 'jpeg'], // Allowed formats
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
