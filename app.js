const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
require('./client.js')
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'node_modules/flowbite/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
