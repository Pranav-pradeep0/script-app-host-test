module.exports = {
  authenticate: (req, res, next) => {
    const { token } = req.cookies;

    next();
  },
  authorise: (req, res, next) => {},
};
