/**
 * ShuttleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


//Add a shuttle to the database 
addShuttle: function (req, res) {
  Shuttle.create({
      name: req.body.name,
			latitude: req.body.latitude,
			longitude: req.body.longitude
      }).exec(function callback(err, shuttle) {
		return res.json(shuttle);
		});
	},
	
	//GET a JSON response with 'id', 'latitude', longitude'
	getShuttleCoords: async function (req, res) {
		var coords = await Shuttle.findOne({
			where: {id: req.param('id')},
			select: ['latitude', 'longitude']
		});
		
		if(!coords) {
			return res.notFound('Could not find shuttle');
		}
		
		return res.json(coords);
		
	}
};

