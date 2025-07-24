const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const communityStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');

    return {
      folder: isVideo ? 'community-videos' : 'community-images',
      resource_type: isVideo ? 'video' : 'image',
      format: file.mimetype.split('/')[1],
      public_id: `community-${Date.now()}`
    };
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov|avi/;
  const ext = file.mimetype.split('/')[1];

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image or video files are allowed'));
  }
};

// 👇 New uploader just for community posts
const uploadCommunityMedia = multer({ storage: communityStorage, fileFilter });

// Export all
module.exports = {
  uploadCommunityMedia
};
