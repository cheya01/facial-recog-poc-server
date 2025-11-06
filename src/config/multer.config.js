const multer = require('multer');

const storage = multer.memoryStorage(); // We'll send file to S3 later

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limit to 5MB
  }
});

module.exports = upload;
