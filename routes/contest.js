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
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

const mimetypes = {
  "images/jpeg" : "jpg",
  "images/gif" : "gif",
  "images/png" : "png",
  "images/pdf" : "pdf"
};

const upload = multer({
  dest: 'tmp',
  fileFilter : (req, file, cb) =>{
    var ext = mimetypes[file.mimetype];
    if(!ext){
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
})

router.get('/create', function(req, res, next){
  res.render('contest/create_con');
});

router.post('/create', needAuth, 
  upload.single('img'), // img라는 필드를 req.file로 저장함.
  catchErrors(async (req, res, next) => {
    //recaptcha
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
      return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }

    var secretKey = "6LeFtn4UAAAAAHbEP248K1sNDemD4IYNp2by5aei";
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl,function(error,response,body) {
      body = JSON.parse(body);
    
      if(body.success !== undefined && !body.success) {
        return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
      }
      res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    });

  var contest = new Contest({
    title: req.body.title,
    company: req.body.company,
    field: req.body.field,
    target: req.body.target,
    manager: req.body.manager,
    phone: req.body.phone,
    address : req.body.address,
    details: req.body.content ,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
  });


  if (req.file) {
    const dest = path.join(__dirname, '../public/images/uploads/');  // 옮길 디렉토리
    console.log("File ->", req.file); // multer의 output이 어떤 형태인지 보자.
    const filename = contest.id + "/" + req.file.originalname;
    await fs.move(req.file.path, dest + filename);
    contest.img = "/images/uploads/" + filename;
  }
  
  await contest.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/');
}));

//공모전 보기
router.get('/:id', catchErrors(async(req,res,next)=> {
  const contest = await Contest.findById(req.params.id).populate('author');
  const comments = await Comments.find({contest: contest.id}).populate('author');
  
  
  res.render('contest/contents',{contest:contest, comments:comments });
}))

//공모전 수정
router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  res.render('contest/edit', {contest: contest});
}));

//공모전 수정 저장
router.put('/:id', needAuth, catchErrors(async(req,res,next)=> {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    req.flash('danger', 'Not exist contest');
    return res.redirect('back');
  }

  contest.title =req.body.title;
  contest.company= req.body.comname;
  contest.field= req.body.field;
  contest.target= req.body.target;
  contest.manager= req.body.manager;
  contest.phone= req.body.phone;
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
  req.flash('success', 'Successfully updated');
  res.redirect('/contents');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Contest.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/contents');
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

  var comment = new Comment({
    author: user._id,
    contest: contest._id,
    content: req.body.content
  });
  await comment.save();
  contest.numcomments++;
  await contest.save();

  req.flash('success', 'Successfully commented');
  res.redirect(`/contest/${req.params.id}`);
}));

module.exports = router;