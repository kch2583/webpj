var express = require('express');
var router = express.Router();
var catchErrors = require('../lib/async-error');
var Contest = require("../models/contest");
var User = require("../models/user");

router.get('/', catchErrors(async(req,res,next)=>{
  const contests = await Contest.find({});
  
  req.flash('success','hi');
  res.render('index', {contests: contests});
}))



module.exports = router;
