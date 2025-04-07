
const auth = (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    req.user = req.session.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const isBroker = (req, res, next) => {
  if (req.user?.role !== 'broker') {
    return res.status(403).json({ message: 'Broker access required' });
  }
  next();
};

module.exports = { auth, isAdmin, isBroker };
