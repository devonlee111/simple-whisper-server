const os = require('os');
const express = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: './uploads' });

router.post('/upload', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

module.exports = router;

