const passport = require('passport');//using passport for authentication
const GoogleStrategy = require('passport-google-oauth2').Strategy;//using strategy of google oauth-2

const GOOGLE_CLIENT_ID = '917984350881-4i6achva2k4vadot7v4rp5hjfkvun24n.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'h9H9wU6WLY8DUM6KmKHPta0A';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://arrogant-mountie-58191.herokuapp.com/auth/google/callback",//callback url after completion
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);//accessing profile
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
