/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var bearerToken;
  var bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(" ");
    bearerToken = bearer[1];

    if (bearer[0] !== "Bearer") {
      return res.forbidden("bearer not understood");
    }


    //verify if this token was from us or not
    jwt.verify(bearerToken, "this is my secret key", function (err, decoded) {
      if (err) {
        sails.log("verification error", err);
        if (err.name === "TokenExpiredError")
          return res.forbidden("Session timed out, please login again");
        else
          return res.forbidden("Error authenticating, please login again");
      }


      User.findOne(decoded.id).exec(function callback(error, user) {
        if (error) return res.serverError(err);

        if (!user) return res.serverError("User not found");

        //check if the date the token was generated is greater than with the last login
        if (new Date(decoded.token_gen_date) < new Date(user.lastlogout))
          return res.forbidden("Please login again, token is not valid");

        req.user = user;
        next();
      });

    });

  } else {
    return res.forbidden("No token provided");
  }
};
