var express = require('express');
var router = express.Router();
var catchErrors = require('../lib/async-error');
var Contest = require("../models/contest");

router.get('/', catchErrors(async(req,res,next)=>{
  const contests = await Contest.find({});
  res.render('index', {contests: contests});
}))

module.exports = router;
