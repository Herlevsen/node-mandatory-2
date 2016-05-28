require('dotenv').config();

module.exports = {
	mongodb: process.env.MONGO_DB,
	passportSecret: process.env.PASSPORT_SECRET
}