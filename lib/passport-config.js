const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>  {
    User.findById(id, done);
  });

  passport.use('local-signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({email: email});
      const authchk = user.auth;
      if (user && await user.validatePassword(password) && authchk == 'admin') {
        return done(null, user, req.flash('success', `어서오세요! ADMIN ${user.name} 님!`));
      } else if(user && await user.validatePassword(password)){
        return done(null, user, req.flash('success', `어서오세요! ${user.name} 님!`));
      }
      return done(null, false, req.flash('danger', '이메일이나 비밀번호가 올바르지 않습니다.'));
    } catch(err) {
      done(err);
    }
  }));
  
  passport.use(new FacebookStrategy({
    clientID : '311542813013784',
    clientSecret : '9c25932ec7fc38d385c229ddbc957137',
    callbackURL : 'https://pacific-plateau-16529.herokuapp.com/auth/facebook/callback',
    //callbackURL : 'http://localhost:3000/auth/facebook/callback',
    profileFields : ['email', 'name', 'picture']
  }, async (token, refreshToken, profile, done) => {
    try {
      var email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : '';
      var picture = (profile.photos && profile.photos[0]) ? profile.photos[0].value : '';
      var name = (profile.displayName) ? profile.displayName : 
        [profile.name.givenName, profile.name.middleName, profile.name.familyName]
          .filter(e => e).join(' ');
      var auth = "normal";
      console.log(email, picture, name, profile.name);
      // 같은 facebook id를 가진 사용자가 있나?
      var user = await User.findOne({'facebook.id': profile.id});
      if (!user) {
        // 없다면, 혹시 같은 email이라도 가진 사용자가 있나?
        if (email) {
          user = await User.findOne({email: email});
        }
        if (!user) {
          // 그것도 없다면 새로 만들어야지.
          user = new User({name: name});
          user.email =  email ? email : `__unknown-${user._id}@no-email.com`;
        }
        // facebook id가 없는 사용자는 해당 id를 등록
        user.facebook.id = profile.id;
        user.facebook.photo = picture;
      }
      user.facebook.token = profile.token;
      user.auth = auth;
      await user.save();
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }));
};
