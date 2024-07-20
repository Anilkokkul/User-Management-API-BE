const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (cookies.accessToken) {
    const obj = jwt.verify(cookies.accessToken, process.env.SECRET_KEY);
    if (!obj._id) {
      res.status(401).json({ message: "Unauthorized user" });
    }
    req.id = obj._id;
    return next();
  }
  res.status(401).send({
    message: "Not Authenticated need to login",
  });
};
