const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.json({ message: 'hello' });
});


router.get('/protected', (req, res) => {

  const authHeader = req.headers['authorization']; // if (authHeader) ... split
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.sendStatus(403);

    // console.log(user.username)

    // add it to request and return it just for check...
    req.username = user.username;
  });

  return res.json({ username: req.username });
});

//
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']; // if (authHeader) ... split
//   const token = authHeader && authHeader.split(' ')[1];
//
//   if (token == null) return res.sendStatus(401);
//
//   jwt.verify(token, "secretkey", (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.username = user.username
//     next()
//   });
// }
//
//
// router.get('/protected', verifyToken, (req, res) => {
//   return res.json({ username: req.username });
// });
//
//
// just for creating a JWT
router.post('/login', (req, res) => {
  // console.log(req.body)
  let { username, password } = req.body;
  if (username !== 'admin' || password !== '1234') {
    return res.status(401).send();
  }

  // it will expire and then you need a refresh token to get a new one
  jwt.sign({ username }, "secretkey", { expiresIn: 200 }, (err, token) => {
    if (err) return res.status(401).send('jwt error');
    return res.json({ token });
  });
  // return res.json( {message: 'done'});
});



module.exports = router;