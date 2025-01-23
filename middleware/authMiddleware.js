const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // L'utente è autenticato, procedi con la richiesta
    }
    res.redirect("/login"); // Non autenticato, reindirizza al login
};

module.exports = { ensureAuthenticated };