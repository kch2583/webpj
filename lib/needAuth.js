var express = require('express');
var router = express.Router();
var catchErrors = require('../lib/async-error');

//login 여부
function needAuth(req, res, next) {
  if (req.isAuthenticated) {
    req.session.auth = 
    next();
  } else {
    req.flash('danger', '먼저 로그인을 해주세요');
    res.redirect('users/login');
  }
}