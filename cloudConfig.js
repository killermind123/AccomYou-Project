const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'AccomYou', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'] // Supported image formats
  }
});

module.exports = { cloudinary, storage };