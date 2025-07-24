const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = file.fieldname === 'logo' ? 'store-logos' : 'product-images';
    return {
      folder,
      resource_type: 'image', // strictly images
      format: file.mimetype.split('/')[1], // auto-detect format
      public_id: `${file.fieldname}-${Date.now()}`
    };
  }
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'product-videos',
      resource_type: 'video',
      format: file.mimetype.split('/')[1],
      public_id: `video-${Date.now()}`
    };
  }
});

// Combined handler (choose storage based on mimetype)
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif/;
  const allowedVideoTypes = /mp4|webm|mov|avi/;

  const ext = file.mimetype.split('/')[1];
  const isImage = allowedImageTypes.test(ext);
  const isVideo = allowedVideoTypes.test(ext);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error('Only image or video files are allowed'));
  }
};

const uploadImage = multer({ storage: imageStorage, fileFilter });
const uploadVideo = multer({ storage: videoStorage, fileFilter });

module.exports = {
  uploadImage,
  uploadVideo
};