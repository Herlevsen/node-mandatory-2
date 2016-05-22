var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

module.exports = {
	address: {
		type: String,
		trim: true
	},
	cityName: {
		type: String,
		trim: true
	},
	postalCode: {
		type: Number,
		trim: true
	},
	location: {
		type: mongoose.Schema.Types.Point,
		index: '2dsphere'
	}
};