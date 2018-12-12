var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var catchErrors = require('../lib/async-error');
var Contest =require('../models/contest');
var fs = require('fs-extra');
var path = require('path');
var multer = require('multer');

//로그인 여부
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next(); 
  } else {
    req.flash('danger', '먼저 로그인을 해주세요');
    res.redirect('admin/adminpw');
  }
};

const mimetypes = {
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png"
};
const upload = multer({
  dest: 'tmp', 
  fileFilter: (req, file, cb) => {
    var ext = mimetypes[file.mimetype];
    if (!ext) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

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
router.get('/users_edit',needAuth, catchErrors(async(req,res,next)=>{
  const users = await User.find({});
  res.render('admin/users', {users: users});
}))

router.get('/contests_edit',needAuth, catchErrors(async(req,res,next)=>{
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

router.delete('/user/:id', needAuth, catchErrors(async(req,res,next)=>{
  var Userid = await User.findOneAndRemove({_id:req.params.id});
  req.flash('success', 'Deleted Successfully!');
  res.redirect('/users');
}))

//edit 버튼을 눌렀을 때 
router.get('/user/:id/edit', needAuth, catchErrors(async(req,res,next)=>{
  var user = await User.findById(req.params.id);
  console.log(user, req.params.id);
  
  res.render('users/edit', {user: user});
}))

//edit 
router.put('/user/:id/edit', needAuth, catchErrors(async(req,res,next)=> {
  var err = validateForm(req.body);
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

router.delete('/contest/:id', needAuth, catchErrors(async(req,res,next)=>{
  var contest = await Contest.findOneAndRemove({_id:req.params.id});
  req.flash('success', '성공적으로 삭제했습니다.!');
  res.redirect('/users');
}))

// contest edit 버튼을 눌렀을 때 
router.get('/contest/:id/edit', needAuth, catchErrors(async(req,res,next)=>{
  var contest = await Contest.findById(req.params.id);
  
  res.render('contest/edit_contest', {contest:contest});
}))

// admin contest edit
router.put('/contest/:id/edit', needAuth, catchErrors(async(req,res,next)=> {
  var err = validateForm(req.body);
  if(err){
    req.flash('danger', err);
    return res.redirect('back');
  }
  const contest = await Contest.findById({_id: req.params.id});
  if (!contest) {
    req.flash('danger', '존재하지 않는 공모전입니다.');
    return res.redirect('back');
  }
  contest.title =req.body.title;
  contest.company= req.body.companyname;
  contest.field= req.body.field;
  contest.target= req.body.target;
  contest.manager= req.body.manager;
  contest.phone= req.body.phone;
  contest.address= req.body.address;
  contest.details= req.body.content ;
  contest.startdate= req.body.startdate;
  contest.enddate= req.body.enddate;

  if (req.file) {
    const dest = path.join(__dirname, '../public/images/uploads/');  // 옮길 디렉토리
    console.log("File ->", req.file); // multer의 output이 어떤 형태인지 보자.
    const filename = contest.id + "/" + req.file.originalname;
    await fs.move(req.file.path, dest + filename);
    contest.img = "/images/uploads/" + filename;
  }
  
  await contest.save();
  req.flash('success', '성공적으로 수정되었습니다.');
  res.redirect('/users/index');
}))

router.post('/userAuthChange/:id/admin',catchErrors(async(req,res,next)=> {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  user.auth = 'admin';
  await user.save();
  return res.json(user);
}))

router.post('/userAuthChange/:id/normal',catchErrors(async(req,res,next)=> {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  user.auth = 'normal';
  await user.save();
  return res.json(user);
}))

module.exports = router;
