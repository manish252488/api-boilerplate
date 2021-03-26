import passport from "passport";

export async function verifyApikey(req, res, next) {
  try {
    let api_key = req.headers["x-api-key"];
    if (req.headers["x-api-key"]) {
      if (api_key === "7777") next();
      else return res.error("api key wrong!");
    } else {
      return res.error("api key missing in headers!");
    }
  } catch (err) {
    return res.error("error verifying api key", err);
  }
}
export async function verifyToken(req, res, next) {
    try{
        passport.deserializeUser(function(id, done) {
         User.findById(id, function (err, user) {
         done(err, user);
  });
});
    }catch (err) {
    return res.error("error authenticating token", err);
  }
}
