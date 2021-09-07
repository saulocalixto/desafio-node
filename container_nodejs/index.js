const express = require('express')
const app = express()
const port = 3000
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};
const mysql = require('mysql');
const conection = mysql.createConnection(config);
let name = '';

let createTable = `create table if not exists people(
  id int not null auto_increment,
  name varchar(255),
  primary key(id)
);`;

conection.query(createTable, function(err, results, fields) {
  if (err) {
    console.log(err.message);
  }
});

const sql = `INSERT INTO people(name) values('Saulo')`;
conection.query(sql)
_this = this;
const getName = 'SELECT name FROM people LIMIT 1;'

conection.query(getName, function (err, result, fields) {
  if (err) throw err;
  Object.keys(result).forEach(function(key) {
    var row = result[key];
    name = row.name;
  });
});

conection.end();

app.get('/', (req, resp) => {
  console.log(name);
  resp.send(`<h1>Full Cycle Rocks!</h1> <ol>${name}</ol>`)
})

app.listen(port, () => {
  console.log(`Rodando na porta ${port}`)
})