var mysql = require('mysql');

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
//connection.close();