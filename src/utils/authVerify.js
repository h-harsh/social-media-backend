const jwt = require("jsonwebtoken");
const { User } = require('../Models/user.model')

const secret = "gEf3gs2kMagd2CHDXpEjwGJlbVewlqE7ARhD2UIYUJsM8V9c71E4rYGI0AXIn5J2pAi2TrMQHD7FAJOTtLIYIShHDjZjTwvzHodjwutvbTcFCnksFiCBFpqpQqucxyairN4X3hQbmiuKqJQW9XSeblgU5v2BQrEZs86YhgrGxQtWujl3NMu9NRwa9x9noEY7OnuabuIAYNCmsnGC39iq32nBOPvtA4BP+sVuMKW6Qd6//lSr1pSzYHZ9KMYUDnTDvnXQ3q5uSpCGcRTS3//G/nfUdjxjcbz1z9B2hvL+Oh/RXNI1DeFdwphwP9pbJqICm81l1WUe0H7Vs/6irJEq6w==";

function authVerify(req, res, next) {
  const token = req.headers.authorization
  try{
    const decoded = jwt.verify(token, secret)
    req.user = { userId: decoded.userId };
    req.token = token
     next()
  } catch(error){
    console.log(error)
    return res.status(401).json({ message: "Unauthorised access, please add the token"})
  }
}

module.exports = {secret, authVerify}