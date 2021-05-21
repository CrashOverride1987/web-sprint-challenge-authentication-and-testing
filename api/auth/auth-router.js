const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkUsernameAndPassword, checkUsernameFree } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); // use this secret!
const Jokes = require('../jokes/jokes-model')

router.post('/register', checkUsernameAndPassword, checkUsernameFree, async (req, res, next) => {
  try{
    const {username, password} = req.body;
    const taken = await auth.getUserBy({ username });

    if(taken){
      return res.status(409).json({
        message: "Username is taken"
      })
    }

    const newUser = await auth.addUser({
      username,
      password: await bcrypt.hash(password, 13)
    })

    return res.status(200).json({
      message: `Welcome ${username}`
    })

  } catch(error){
    console.log(error)
  }
  /*
    
  

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
