var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var catchErrors = require('../lib/async-error');
var Contest = require('../models/contest');

//login 여부
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '먼저 로그인을 해주세요');
    res.redirect('/login');
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

router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const users = await User.paginate(query, {
    sort: {createdAt: -1}, 
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('admin/index', {users:users, query: req.query});
}));


//회원가입을 클릭했을 때
router.get('/create', function(req,res,next){
  res.render('users/create');
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
    auth : "normal",
   
  });
  user.password = await user.generateHash(req.body.password);
 
  await user.save();
  req.flash('success', '회원가입에 성공하였습니다.');
  res.redirect('/');
}))

// user 삭제
router.delete('/:id', needAuth, catchErrors(async(req,res,next)=>{
  var Userid = await findOneAndRemove({_id:req.params.id});
  req.flash('success', 'Deleted Successfully!');
  res.redirect('/users');
}))

//edit 버튼을 눌렀을 때 
router.get('/:id/edit', needAuth, catchErrors(async(req,res,next)=>{
  var user = await User.findById(req.params.id);
  res.render('users/edit', {user: user});
}))

//edit 
router.put('/:id/edit', needAuth, catchErrors(async(req,res,next)=> {
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

router.get('/:id/favorite',needAuth ,catchErrors(async(req,res,next)=>  {  
  // var favorites = await Favorite.find({author :req.params.id});
 
  
  var user = await User.findById(req.params.id);
  console.log(user.favorites);
  var contests = await Contest.findById( {$in:[ user.favorites ]});
  // {$in:[favorites.favorites]}
 
  res.render('users/favorite', {contests:contests});
}));

router.get('/favorite', catchErrors(async(req,res,next)=>  {
  if(!req.user){
  req.flash('danger', '로그인이 필요합니다.');
  res.redirect('/login');
  }
}));

router.get('/edit', catchErrors(async(req,res,next)=>  {
  if(!req.user){
  req.flash('danger', '로그인이 필요합니다.');
  res.redirect('/login');
  }
}));


module.exports = router;
