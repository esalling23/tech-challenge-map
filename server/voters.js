const db = require('../db') //this is required
const Voter = require('../db/models/voter');

const router = require('express').Router()

router.get('/', function(req, res, next) {
    Voter.findAll()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(next);
});



module.exports = router;
