/**
 * Dependencies
 */
const mongoose    = require('mongoose');
const passportJwt = require('passport-jwt');
const config      = require('./index.js');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt  = passportJwt.ExtractJwt;

const User        = mongoose.model('User');

module.exports = function(passport) {

	var opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.passportSecret;

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

		User.findOne({_id: jwt_payload._id}, function(err, user) {
			if (err) {
			  return done(err, false);
			}

			if (user) {
			  done(null, user);
			} else {
			  done(null, false);
			}
		});
	}));

}