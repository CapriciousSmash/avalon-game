const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.use(express.static(__dirname + '/../client/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve index.html for rest
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});

const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
  console.log('Listening on port', port);
});