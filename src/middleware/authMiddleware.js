exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
};

exports.ensureRole = (role) => (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === role) return next();
  return res.status(403).send('Acceso denegado: requiere rol ' + role);
};

// Nueva función: valida que el usuario exista y tenga permiso para editar historial médico
exports.ensureCanEditMedical = (req, res, next) => {
  if (req.session && req.session.user) {
    const role = req.session.user.role;
    // Permitimos Veterinario y Administrador
    if (role === 'Veterinario' || role === 'Administrador') return next();
  }
  return res.status(403).send('Acceso denegado: sólo Veterinario o Administrador pueden editar historial médico');
};
