/**
 * Dependencies
 */
const mongoose    = require('mongoose');
const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt  = passportJwt.ExtractJwt;

const User        = mongoose.model('User');

module.exports = function(passport) {

	var opts = {}
	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = 'secret';

	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
		console.log(jwt_payload);

		User.findOne({id: jwt_payload.id}, function(err, user) {
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