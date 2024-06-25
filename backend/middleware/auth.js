const ensureAuthenticated = (req, res, next) => {
  console.log('Checking authentication');
  console.log('req.isAuthenticated:', req.isAuthenticated ? req.isAuthenticated() : 'isAuthenticated not defined');
  console.log('req.user:', req.user);

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { ensureAuthenticated };
