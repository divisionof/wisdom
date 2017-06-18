const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
  res.setHeader('Content-Type', 'text/html')
  res.send('All difficulties are easy when they are known.')
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
