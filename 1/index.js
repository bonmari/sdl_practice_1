const readline = require('node:readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question(`Enter username \n`, (name) => {
  readline.question(`Enter password \n`, (password) => {
    connectDb(name, password);
    readline.close();
  });
});

const { Client } = require('pg');
require('dotenv').config();

const connectDb = async (name, password) => {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    // user: process.env.PG_USER,
    // password: process.env.PG_PASSWORD,
    user: name,
    password: password,
    database: process.env.PG_DATABASE,
    ssl: false,
  });
  await client.connect();
  const status = await client.query('SELECT $1::text as connected', [
    'Connection to postgres successful!',
  ]);
  console.log(status.rows[0].connected);
  const res = await client.query('select VERSION()::text as connected');
  console.log(res.rows[0].connected);
  await client.end();
};
