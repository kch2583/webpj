var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var Contest = require('../models/contest')
var Comments = require("../models/comments");
var multer = require('multer');
var fs = require('fs-extra');
var path = require('path');
var request = require('request');
const catchErrors = require('../lib/async-error');

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인을 먼저 해주세요!');
    res.redirect('/login');
  }
}

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

//공모전 생성
router.get('/create',needAuth, function(req, res, next){
  res.render('contest/create_con');
});

//공모전 생성
router.post('/create', needAuth, 
  upload.single('img'), // img라는 필드를 req.file로 저장함.
  catchErrors(async (req, res, next) => {


  // var user = await User.findById(req.user._id);
  var contest = new Contest({
    title: req.body.title,
    company: req.body.companyname,
    field: req.body.field,
    target: req.body.target,
    manager: req.body.manager,
    email: req.body.email,
    phone: req.body.phone,
    address : req.body.address,
    details: req.body.content ,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });


  if (req.file) {
    const dest = path.join(__dirname, '../public/images/uploads/');  // 옮길 디렉토리
    const filename = contest.id + "/" + req.file.originalname;
    await fs.move(req.file.path, dest + filename);
    contest.img = "/images/uploads/" + filename;
  }
  
  await contest.save();
  req.flash('success', '성공적으로 등록되었습니다.');
  res.redirect('/');
}));

//본인이 작성한 공모전 보기
router.get('/mycontests', needAuth,catchErrors(async(req,res,next)=> {
  const contests = await Contest.find({author:req.params.id}).populate('author');
  res.render('contest/mycontests',{contests:contests});
}))

//공모전 보기
router.get('/:id' ,catchErrors(async(req,res,next)=> {
  const contest = await Contest.findById(req.params.id).populate('author');
  const comments = await Comments.find({contest: contest.id}).populate('author'); 
  
  const user1 = req.session.id;
  const reader = await Contest.find({reader: req.session.id}).populate('author');
  
  if (!reader){
    contest.reader.push(user1);
    contest.numReads++; 
  }
  await contest.save();
  res.render('contest/contents',{contest:contest, comments:comments });
}))

//공모전 수정
router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  res.render('contest/edit_contest', {contest: contest});
}));

//공모전 수정 저장
router.put('/:id/edit', needAuth,upload.single('img'), catchErrors(async(req,res,next)=> {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    req.flash('danger', 'Not exist contest');
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
  res.redirect('/');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Contest.findOneAndRemove({_id: req.params.id});
  req.flash('success', '성공적으로 삭제되었습니다.');
  res.redirect('/');
}));


router.get('/map', (req,res,next)=>{
  var address = req.query.address;
  if(!address){
    console.log("해햇");
    return res.json([]); 
   
  }
  console.log(address);
  return res.json(address);
})

router.post('/:id/comments', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const contest = await Contest.findById(req.params.id);

  if (!contest) {
    req.flash('danger', 'Not exist contest');
    return res.redirect('back');
  }

  var comment = new Comments({
    author: user._id,
    contest: contest._id,
    comments: req.body.content
  });
  await comment.save();
  contest.numcomments++;
  await contest.save();

  req.flash('success', 'Successfully commented');
  res.redirect(`/contest/${req.params.id}`);
}));

router.post('/search',  catchErrors(async (req, res, next) => {
  //const contests = await Contest.find({$or:[{title: /req.body.search/},{details: /req.body.search/}]});
  var search = req.body.search;
  const contests = await Contest.find({$or:[{title:{ $regex: search } },{details: {$regex: search}}]});
  console.log(contests, req.body.search);
  
  //empty array check 안됨
  if (!contests){
    req.flash('danger', '검색결과가 없습니다.');
    return res.redirect('back');
  }else{
    res.render('index', {contests: contests});
  }
}));

router.post('/search2',  catchErrors(async (req, res, next) => {
  //const contests = await Contest.find({$or:[{title: /req.body.search/},{details: /req.body.search/}]});
  var field = req.body.field;
  var target = req.body.target;
  const contests = await Contest.find({$or:[{target:{$in:[target]} },{field: {$in:[field]} }]});
  console.log(contests.target, contests.field);
  
  list= []; 

  //empty array check 안됨
  if (!contests){
    req.flash('danger', '검색결과가 없습니다.');
    return res.redirect('back');
  }else{
    res.render('index', {contests: contests});
  }
}));

module.exports = router;