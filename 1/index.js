const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { Client, Pool } = require('pg');
require('dotenv').config();

const config = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: false,
};

let dbConneted = false;

const sqlQuery = 'select VERSION()::text as connected';
console.log('config', config);
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: false,
});
const connect = () => {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error('connection error', err);
    }
    client.query(sqlQuery, function (err, result) {
      done();

      if (err) {
        return console.error('error running query', err);
      }
      console.log('connected');
      dbConneted = true;
    });
  });
};

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err) 
})

setInterval(() => {
  connect()
},  process.env.PING_INTERVAL * 1000);
