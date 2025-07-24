const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const type = file.mimetype.startsWith('video/') ? 'video' : 'image';
    const folder = type === 'video' ? 'shopper-videos' : 'shopper-images';

    return {
      folder,
      resource_type: type, // this is critical for video support
      public_id: `${type}-${Date.now()}`,
    };
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
  const ext = file.mimetype.split('/')[1];
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error('Unsupported file type'));
};

const uploadMedia = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // up to 500MB
  fileFilter
});

module.exports = uploadMedia;
