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
  res.sendFile(path.join(__dirname, '/login.html'));
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		res.sendFile(path.join(__dirname, '/index.html'));
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname + '/login.html'));
// });

const listener = app.listen(process.env.PORT, function(){
  console.log('your app is running on port ' + listener.address().port);
})
