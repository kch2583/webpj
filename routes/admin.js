var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var catchErrors = require('../lib/async-error');

//로그인 여부
function needAuth(req, res, next) {
  if (user.auth == 'auth') {
    next(); 
  } else {
    req.flash('danger', '먼저 로그인을 해주세요');
    res.redirect('admin/adminpw');
  }
};

function validateForm(form, options) {
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return 'Name is required.';
  }

  if (!email) {
    return 'Email is required.';
  }

  if (!form.password && options.needPassword) {
    return 'Password is required.';
  }

  if (form.password !== form.password_confirmation) {
    return 'Passsword do not match.';
  }

  if (form.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}

// /* GET users listing. */
router.get('/users',needAuth, catchErrors(async(req,res,next)=>{
  const users = await User.find({});
  res.render('admin/users', {users: users});
}))

router.get('/contest',needAuth, catchErrors(async(req,res,next)=>{
  const contests = await Contest.find({});
  res.render('admin/contest', {contests: contests});
}))

// admin 계정 생성 들어가기
router.get('/create', function(req,res,next){
  res.render('admin/create', {messages: req.flash('hi')});
});

// // admin 계정 생성 폼 클릭
router.post('/create', catchErrors(async (req,res,next)=>{
  var err = validateForm(req.body, {needPassword:true});
  if(err){
    req.flash('danger', err);
    return res.redirect('back');
  }
  var user = await User.findOne({email: req.body.email});
  if (user) {
    req.flash('danger', 'ALREADY EXISTS');
    return res.redirect('back');
  }
  var user = new User({
    name : req.body.name,
    email : req.body.email,
    auth : 'admin',
   
  });
  user.password = await user.generateHash(req.body.password);
 
  await user.save();
  req.flash('success', 'admin 계정을 생성하였습니다.');
  res.redirect('/admin/index');
}));

module.exports = router;
