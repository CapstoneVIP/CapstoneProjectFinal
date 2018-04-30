/**
 * Shuttle.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

 //Shuttle Attributes
  attributes: {
    name: {
      type: 'string',
      required: true,
			unique: true
    },
    latitude: {
      type: 'number',
			required: false,
			allowNull: true
    },
      longitude: {
      type: 'number',
			required: false,
			allowNull: true
		},
			mph: {
				type: 'number',
				required: false,
				allowNull: true
			}
	},
};

