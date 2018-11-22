var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var catchErrors = require('../lib/async-error');

//login 여부
function needAuth(req, res, next) {
  if (req.isAuthenticated) {
    next();
  } else {
    req.flash('danger', '먼저 로그인을 해주세요');
    res.redirect('users/login');
  }
}


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



/* GET users listing. */
router.get('/', needAuth, catchErrors(async(req,res,next)=>{
  const users = User.find({});
  res.render('admin/index', {users: users});
}))

//회원가입을 클릭했을 때
router.get('/create', function(req,res,next){
  res.render('users/create', {messages: req.flash('hi')});
  //
});

//회원가입 폼을 입력하고 제출했을 때
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
    auth : req.body.auth,
   
  });
  user.password = await user.generateHash(req.body.password);
 
  await user.save();
  req.flash('success', '로그인에 성공하였습니다.');
  res.redirect('/');
}))

// user 삭제
router.delete('/:id', needAuth, catchErrors(async(req,res,next)=>{
  var Userid = findOneAndRemove({_id:req.params.id});
  req.flash('success', 'Deleted Successfully!');
  res.redirect('/users');
}))

//edit 버튼을 눌렀을 때 
router.get('/:id/edit', needAuth, catchErrors(async(req,res,next)=>{
  var user = User.findById(req.params.id);
  res.render('users/edit', {user: user});
}))

//edit 
router.put('/:id/edit', needAuth, catchErrors(async(req,res,next)=> {
  var err = validatechk(req.body);
  if(err){
    req.flash('danger', err);
    return res.redirect('back');
  }
  const user = await User.findById({_id: req.params.id});
  if (!user) {
    req.flash('danger', '존재하지 않는 사용자입니다.');
    return res.redirect('back');
  }
  if(user.password !== req.body.current_password){
    req.flash('danger', '비밀번호가 일치하지 않습니다.');
    return res.redirect('back');
  }
  user.name = req.body.name;
  user.email = req.body.email;
  user.auth = req.body.auth;
  if(req.body.password){
    user.password = await user.generateHash(req.body.password);
  }

  await user.save();
  req.flash('success', '성공적으로 변경했습니다.');
  res.redirect('/users/index');
}))

router.get('/:id', function(req, res) {
  // users 밑에 뭔가 더 추가했을때 
  //: --> params 으로 받아짐 

 // title : req.params.id ;
})
module.exports = router;
