var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var logined = req.session.logined;
  req.flash('success','hi');
  console.log(req.session);
  res.render('index', { title: 'Express', disuser: req.session.user});
});

module.exports = router;
