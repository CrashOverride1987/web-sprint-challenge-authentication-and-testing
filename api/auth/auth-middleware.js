const { JWT_SECRET } = require("../secrets"); // use this secret!
const Jokes = require('../jokes/jokes-model')
const jwt = require('jsonwebtoken')

const restricted = async (req, res, next) => {

const token = req.headers.authorization

  if (!token) {
    return next({ status: 401, message: 'Token required'})
  } 
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'Token invalid'})
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
}

const only = role_name => (req, res, next) => {
  const {roleName} = req.decodedToken
  if (role_name === roleName) {
    next()
  } else {
    next({ status: 403, message: 'This is not for you'})
  }
}
async function checkUsernameFree(req, res, next) {
    try { 
      const users = await Jokes.findBy({ username: req.body.username})
      if (!users.length) {
        next()
      }
      else {
        next({ message: "Username taken", status: 422})
      }
    } catch (err) {
      next(err)
    }
    }

const checkUsernameAndPassword = async (req, res, next) => {
  try {
    const [user] = await Jokes.findBy({username: req.body.username})
    const [password] = await Jokes.findBy({password: req.body.password})
    if (!user || !password) {
      next({ status: 422, message: 'username and password required'})
    } else if (password !== req.user.password) {
        next({message: 'invalid credentials'})
    } else {
      req.user = user
      next()
    }
  }
  catch (err) {
    next(err)
  }
}




module.exports = {
  restricted,
  checkUsernameAndPassword,
  checkUsernameFree,
  only,
}
