const jwt =  require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'secret_this_should_be_a_long_string');
    req.userDetails = {email: decodedToken.email, id: decodedToken.id};
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication Failed!!"});
  }
};
