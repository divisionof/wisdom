const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
var   connected = false;

app.use(bodyParser.urlencoded({extended: true}));

// serving static files
app.use(express.static('public'));

// nunjucks templating
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});
app.engine('html', nunjucks.render) ;
app.set('view engine', 'html') ;

// db
var datastore = require('./datastore').sync;
datastore.initializeApp(app);

// endpoints
app.get('/', function(req, res) {
  res.render('index', {
    title: 'Wisdom',
    description: 'all difficulties are easy when they are known'
  });
});

app.get('/pearls', function(req, res) {
  try {
    if(!connected){
      connected = datastore.connect();
    }
    //get pearls of wisdom from db
    var pearls = datastore.get('pearls');
    res.render('wisdom', {
      pearls: pearls
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/wisecrack', function(req, res) {
  // console.log(req.body)
  const {command, text, user_name, token} = req.body;
  console.log(`got a command from ${user_name}: ${command} ${text}`);
  
  if(token != process.env.SLACK_TOKEN){ //Prevent endpoint from being being used nefariously.
    res.send('Invalid token...');
    return;
  }

  if(!connected){
    connected = datastore.connect();
  }
  //get pearls of wisdom from db
  var pearls = datastore.get('pearls');
  
  pearls.sort(function() {return 0.5 - Math.random()})
  
  const response = pearls[0]['pearl'];
  
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({ 
    response_type: 'ephemeral',
    text: response + text
  }));
});

function handleError(err, res) {
  res.status(500);
  res.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
