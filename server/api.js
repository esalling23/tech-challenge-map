const api = module.exports = require('express').Router()
const voters = require('./voters');
const voting = require('./voting');
// import voters from './voters';
api
  .use('/voting', voting)
  .use('/voters', voters)
// No routes matched? 404.
api.use((req, res) => res.status(404).end())
