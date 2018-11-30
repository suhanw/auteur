const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/linkpreview', function (req, res) {
  request({
    url: req.body.linkUrl,
    method: 'GET',
    timeout: 500, // to avoid lingering http requests
    gzip: true, // to decompress html body
  },
    function (err, response, responseHtml) {
      if (err) return res.status(404).end();
      return res.json(responseHtml).end();
    })
})

module.exports = router;