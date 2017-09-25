const db = require('../db') //this is required
const Voter = require('../db/models/voter');

const router = require('express').Router()

router.post('/', function(req, res, next) {

    console.log(req.body, " in the voting route");
    Voter.create({
        'title': req.body.title,
        'address': req.body.address, 
        'approves': req.body.approves
    })
    .then(result => {
        res.status(200).send(result);
        console.log(result);
    })
    .catch(next);
});

module.exports = router;
