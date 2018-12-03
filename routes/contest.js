var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var multer = require('multer');
var fs = require('fs-extra');
var path = require('path');
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
  "images/png" : "png"
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
  res.render('contest/create');
});

router.post('/create', needAuth, 
  upload.single('img'), // img라는 필드를 req.file로 저장함.
  catchErrors(async (req, res, next) => {

  var contest = new Question({
  title: req.body.title,
  author: req.user._id,
  content: req.body.content,
  tags: req.body.tags.split(" ").map(e => e.trim()),
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
  res.redirect('/questions');
}));

