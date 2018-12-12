var express = require('express');
var router = express.Router();
var catchErrors = require('../../lib/async-error');
var Contest = require("../../models/contest");
var User = require("../../models/user");
var Comments = require("../../models/comments");
var LikeLog = require('../../models/like-log');
var HateLog = require('../../models/hate-log');


router.use('/contest', require('../contest'));

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/login');
  }
}

// Like for Contest
router.post('/contest/:id/like', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    console.log('hoi');
    return next({status: 404, msg: 'Not exist contest'});
  }
  console.log(req.user._id);
  var likeLog = await LikeLog.findOne({author: req.user._id, contest: contest._id});
  if (!likeLog) {
    contest.numLikes++;
    await Promise.all([
      contest.save(),
      LikeLog.create({author: req.user._id, contest: contest._id})
    ]);
  }
  console.log('hi');
  
  return res.json(contest);
}));

// Like cancel for Contest
router.post('/contest/:id/notlike', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    console.log('hoi');
    return next({status: 404, msg: 'Not exist contest'});
  }
  console.log(req.user._id);
  var likeLog = await LikeLog.findOne({author: req.user._id, contest: contest._id});
  if (likeLog) {
    contest.numLikes--;
    await Promise.all([
      contest.save(),
      LikeLog.findOneAndDelete({author: req.user._id, contest: contest._id})
    ]);
  }
  console.log('hi');
  
  return res.json(contest);
}));

//hate for contest
router.post('/contest/:id/hate', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    console.log('hoi');
    return next({status: 404, msg: 'Not exist contest'});
  }
  console.log(req.user._id);
  var hateLog = await HateLog.findOne({author: req.user._id, contest: contest._id});
  if (!hateLog) {
    contest.numHates++;
    await Promise.all([
      contest.save(),
      HateLog.create({author: req.user._id, contest: contest._id})
    ]);
  }
  return res.json(contest);
}));

//hate cancel for contest 
router.post('/contest/:id/nothate', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    console.log('hoi');
    return next({status: 404, msg: 'Not exist contest'});
  }
  console.log(req.user._id);
  var hateLog = await HateLog.findOne({author: req.user._id, contest: contest._id});
  if (hateLog) {
    contest.numHates--;
    await Promise.all([
      contest.save(),
      HateLog.findOneAndDelete({author: req.user._id, contest: contest._id})
    ]);
  }
  console.log('hi');
  
  return res.json(contest);
}));

// Like for Answer
router.post('/comments/:id/like', catchErrors(async (req, res, next) => {
  const comments = await Comments.findById(req.params.id);
  comments.numLikes++;
  await comments.save();
  return res.json(comments);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

// Like cancel for Answer
router.post('/comments/:id/notlike', catchErrors(async (req, res, next) => {
  const comments = await Comments.findById(req.params.id);
  comments.numLikes--;
  await comments.save();
  return res.json(comments);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

// hate for Answer
router.post('/comments/:id/hate', catchErrors(async (req, res, next) => {
  const comments = await Comments.findById(req.params.id);
  comments.numHates++;
  await comments.save();
  return res.json(comments);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

// Like cancel for Answer
router.post('/comments/:id/nothate', catchErrors(async (req, res, next) => {
  const comments = await Comments.findById(req.params.id);
  comments.numHates--;
  await comments.save();
  return res.json(comments);
}));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

// favorite click button
router.post('/contest/:id/favorite', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  if(!req.user){
    return next({status: 401});
  }
  else{
    var user = await User.findById(req.user.id);
    if (user.favorites.indexOf(contest._id) == -1){ 
    await user.favorites.push(contest._id);
    console.log(user._id,  user.favorites);
    }
    await user.save();
    return res.json(contest);
  }
}));

// cancel favorite click button
router.post('/contest/:id/notfavorite', catchErrors(async (req, res, next) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) {
    return next({status: 404, msg: 'Not exist contest'});
  }
  if(req.user){
    //var favorite = await Favorite.findOneAndDelete({favorites: contest._id});
    var user = await User.findById(req.user.id);
    await user.favorites.remove(contest._id);
    //await favorite.save();
    await user.save();
    return res.json(contest);
  }
  else{
    return next({status: 401});
  }
}));

module.exports = router;
