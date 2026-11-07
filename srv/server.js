const cds = require('@sap/cds');
const express = require('express');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const INDEX_FILE = 'index-simple.html';

// Register the frontend before CAP adds its own middleware, so our
// index page takes precedence over CAP's generated welcome page at "/".
cds.on('bootstrap', (app) => {
  app.get('/', (req, res) => res.sendFile(path.join(APP_DIR, INDEX_FILE)));
  app.use(express.static(APP_DIR, { index: INDEX_FILE }));
});

module.exports = cds.server;
