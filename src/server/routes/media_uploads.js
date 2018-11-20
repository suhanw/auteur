const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload/photo', upload.array('media'), function (req, res) {
  console.log(req.files);
  console.log(req.body);
});

module.exports = router;