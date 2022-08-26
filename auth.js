const passport = require('passport');//using passport for authentication
const GoogleStrategy = require('passport-google-oauth2').Strategy;//using strategy of google oauth-2

const GOOGLE_CLIENT_ID = '1016736664716-mbmtnijl2ihb64c68agj8crlsmcu9ih3.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",//callback url after completion
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
