var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

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
    var employee_id = req.body.employee_id;
    var password = req.body.password;
    if(employee_id && password){
        connection.query('SELECT * FROM users WHERE employee_id = ? AND password = ?', [employee_id, password], function(err, res, fields){
            if(res.length > 0){
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
//connection.close();