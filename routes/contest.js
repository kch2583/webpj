var express = require('express');
var router = express.Router();
var User  = require("../models/user");
var multer = require('multer');
var fs = require('fs-extra');
var path = require('path');

const mimetypes = {
  "images/jpeg" : "jpg",
  "images/gif" : "gif",
  "images/png" : "png"
};
