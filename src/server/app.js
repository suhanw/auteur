const express = require('express');
const app = express();

app.get("/api", function(req, res) {
  res.send('this is the API endpoint');
});

app.listen(8080, function() {
  console.log('Listening on 8080');
});
