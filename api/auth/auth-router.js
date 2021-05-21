const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkUsernameAndPassword, checkUsernameFree } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); // use this secret!
const Jokes = require('../jokes/jokes-model')

router.post('/register', checkUsernameAndPassword, checkUsernameFree, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(
    password,
    8,
    )
    Jokes.add({ username, password: hash})
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)
 });


router.post('/login', checkUsernameAndPassword, (req, res, next) => {
  const {password} = req.body;
  if (bcrypt.compareSync(password, req.user.password)) {
    const token = buildToken(req.user)
   res.json({message: `welcome, ${req.user.username}`, token})
  } else {
    next({message: 'Invalid credentials'})
  }
 
});
function buildToken(user) {
  const payload = {
    id: user.id,
    password: user.password,
    username: user.username,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, JWT_SECRET, options)
}
module.exports = router;
