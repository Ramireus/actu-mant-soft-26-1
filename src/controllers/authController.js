const userModel = require('../models/userModel');

exports.getLoginForm = (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  userModel.verifyCredentials(username, password, (err, user) => {
    if (err) return res.status(500).send('Error interno');
    if (!user) {
      return res.render('login', { title: 'Iniciar Sesión', error: 'Credenciales inválidas' });
    }
    // Guardar usuario en sesión (no almacenar password)
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect('/');
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
