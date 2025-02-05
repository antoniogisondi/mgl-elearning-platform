const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // L'utente è autenticato, procedi con la richiesta
    }
    res.redirect("/login"); // Non autenticato, reindirizza al login
};

const authStudents = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      return res.status(401).json({ message: "Non autenticato" });
  }
};

module.exports = { ensureAuthenticated, authStudents };
