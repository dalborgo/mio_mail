var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.locals.mail = ''
    res.render('index', {mail: req.flash('signupMessage')});
});

router.post('/', function (req, res, next) {
    //res.render('index', {mail: req.body.email});
    req.flash('signupMessage', req.body.email)
    res.redirect('/')
    //res.end('ciao')
});

module.exports = router;
