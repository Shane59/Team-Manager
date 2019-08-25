const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser());
app.use(morgan());

app.use(express.static('public'));

//reading css files via express server
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const listener = app.listen(process.env.PORT, function(){
  console.log('your app is running on port ' + listener.address().port);
})

