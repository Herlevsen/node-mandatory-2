exports.index = function(req, res) {
	res.json([
		{
			id: 1,
			name: "Møbler",
			slug: "moebler"
		},
		{
			id: 2,
			name: "Elektronik",
			slug: "elektronik"
		}
	]);
}