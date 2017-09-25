const db = require('../db') //this is required
const Voter = require('../db/models/voter');

const router = require('express').Router()

router.post('/', function(req, res, next) {

    console.log(req);
    Voter.create({
        'title': 'string',
        'address': 'string', 
        'vote': true
    })
    .then(result => {
        res.status(200).send(result);
        console.log(result);
    })
    .catch(next);
});

module.exports = router;
