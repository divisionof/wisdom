const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.send('All difficulties are easy when they are known.');
});

app.post("/wisecrack", function(req, res) {
  // console.log(req.body)
  const {command, text, user_name, token} = req.body;
  console.log(`got a command from ${user_name}: ${command} ${text}`);
  
  if(token != process.env.SLACK_TOKEN){ //Prevent endpoint from being being used nefariously.
    res.send("Invalid token...");
    return;
  }
  
  const response = " Wisdom of the gods ";
  
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({ 
    response_type: "ephemeral",
    text: response + text
  }));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
