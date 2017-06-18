const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

app.use(bodyParser.urlencoded({extended: true}));

// nunjucks templating
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
app.engine('html', nunjucks.render) ;
app.set('view engine', 'html') ;

// endpoints
app.get("/", function(req, res) {
  res.render('index', {
  	title: 'Wisdom',
  	description: 'All difficulties are easy when they are known.'
  });
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
