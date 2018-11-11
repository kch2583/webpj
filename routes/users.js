var express = require('express');
var router = express.Router();
var User  = require("../models/user");


function needAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('users/login');
  }
}

/* GET users listing. */
router.get('/',needAuth, function(req, res, next) {
  User.find({}, function(err, users){
    if (err) {
      return next(err);
    }
   res.render('users/index', {users: users});
  //  res.render('users/index');
  })
});

//로그인 클릭했을 때
router.get('/login', function(req,res,next){
  res.render('users/login');
});

//로그인 폼을 입력하고 제출을 눌렀을 때
router.post('/login', function(req,res,next){
  res.render('users/index');
})

//회원가입을 클릭했을 때
router.get('/create', function(req,res,next){
  res.render('users/create', {messages: req.flash('hi')});
  //
});

//var pwchk = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{4,12}$/; //비번 체크


//회원가입 폼을 입력하고 제출했을 때
router.post('/create', function(req,res,next){

  var user1 = new User({
    name : req.body.name,
    email : req.body.email,
    password : req.body.password,
  });


  user1.save(function(err){
    if(err){
      console.error(err);
    //  res.json({result:0});
      return;
    }

  // res.json({result: 1});
    res.render('users/index');
   
  })
});

router.get('/:id', function(req, res) {
  // users 밑에 뭔가 더 추가했을때 
  //: --> params 으로 받아짐 

 // title : req.params.id ;
})
module.exports = router;
