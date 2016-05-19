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
	coordinates: {
		type: [Number],
		index: '2dsphere'      // create the geospatial index
	}
};