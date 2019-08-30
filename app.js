const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
var mysql = require('mysql');
var session = require('express-session');

app.use(bodyParser());
app.use(morgan());

app.use(express.static('public'));

//reading css files via express server
app.use("/assets", express.static(path.join(__dirname, "assets")));


// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname + '/login.html'));
// });

const listener = app.listen(process.env.PORT, function(){
  console.log('your app is running on port ' + listener.address().port);
})

app.use(session({
    secret: 'select',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



var connection = mysql.createConnection({
    host : 'localhost',
    database : 'team_manager',
    user : 'root',
    password : 'Shinya0509',
});

connection.connect(function(err){
    if (err){
        console.log('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
    
});

connection.query('SELECT * FROM users', function(err, results, fields){
    if(err) throw err;
    results.forEach(result => {
        console.log(result);
        
    });
});

app.post('/auth', function(req, res){
  console.log('hi');
    var employee_id = req.body.employee_id;
    var password = req.body.password;
    if(employee_id && password){
        connection.query('SELECT * FROM users WHERE employee_id = ? AND password = ?', [employee_id, password], function(err, result, fields){
          console.log('showing the result');
          console.log(result);
            if(result === undefined){
              console.log('UNDEFINED!');
              res.send('Incorrect employee ID and/or password!');
              return;
            }
            if(result.length > 0){
                req.session.loggedin = true;
                req.session.employee_id = employee_id;
                res.redirect('/index');
            }
            else{
                res.send('Incorrect employee ID and/or password!');
            }
            res.end();
        });
    }
    else{
        res.send('Please enter Employee ID and Password!');
        res.end();
    }
});

app.post('/signup', function(req, res){
  var employee_id = req.body.employee_id;
  var password = req.body.password;
  var department = req.body.department;
  var email = req.body.email;

  connection.query('INSERT INTO users VALUES (?, ?, ?, ?)', [employee_id, password, department, email], function(err, result, field){
    console.log(result);
    console.log('entering the data into the database!');
    if(result === undefined){
      res.send('You are not registered yet! Please try again!')
    }
    else{
      res.redirect('/login');

    }
  })
})

app.get('/', function(request, response) {
	if (request.session.loggedin) {
    console.log('you are logged in');
		response.sendFile(path.join(__dirname, '/index.html'));
	} else {
    response.redirect('/login')
	}
    // response.end();
});

app.get('/login', function(req, res){
  res.sendFile(path.join(__dirname, '/login.html'));
});
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/signup.html'));
});
//connection.close();