/*
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


var bcrypt = require("bcryptjs");

module.exports =   {

  //User Attributes
  attributes: {
    firstname: {
      type: 'string',
      required: true
    },
    lastname: {
      type: 'string',
      required: true
    },
    roles: {
      type: 'string',
      defaultsTo: "DEFAULT_USER"
     },
    email: {
      type: 'string',
	  required: true,
      unique: true,
	  isEmail: true
    },
    password: {
      type: 'string',
      required: true
    },
    lastlogout: {
      type:'string'
    },
  },
  
  //Ommitting the password for json response
  customToJSON: function() {
     return _.omit(this, ['password'])
  },
  
  /**
  * Lifecycle Callbacks
  */
  //This one is supressing error, but not really working.... would like it to return a message
  beforeCreate: function(user, cb) {
    User.findOne({email: user.email}).exec(function (err, record) {
	  console.log('before validation emalil check ' + !err && !record);
	  //unique = !err && !record;
      cb();
    });
  },
  
  /**
   * this is called so we can create our password hash for us
   *
   * before saving
   * @param values
   * @param cb
   */
  beforeCreate: function (values, cb) {

    // Hash password
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return cb(err);
      values.password = hash;
      cb();
    });
  },
  
  /**
   * this holds our validation message by
   * sails-hook-validation dependency
   */
  validationMessages: { //hand for i18n & l10n
    email: {
      email: 'Provide valid email address',
      required: 'Email is required',
      unique: 'This email is already existing'
    },
    password: {
      required: 'Password is required'
    }
  }
};
