var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var catchErrors = require('../lib/async-error');


/* GET users listing. */
router.get('/users', catchErrors(async(req,res,next)=>{
  const users = User.find({});
  res.render('admin/users', {users: users});
}))

// /admin으로 들어갔을 때 admin로그인창으로 감
router.get('/', catchErrors(async(req,res,next)=>{
  res.render('admin/adminpw');
}))

//admin 로그인
router.post('/password', catchErrors(async(req,res,next)=>{
  var user = await User.findOne({email: req.body.email});
  if(user.auth == 'auth'){
    req.flash('success', 'welcome admin')
    res.render('admin/index');
  }
}));

module.exports = router;
