const db = require('../config/db');
const bcrypt = require('bcryptjs');

const userModel = {
  findByUsername(username, cb) {
    const sql = 'SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1';
    db.get(sql, [username], (err, row) => cb(err, row));
  },

  create(user, cb) {
    const hashed = bcrypt.hashSync(user.password, 8);
    const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.run(sql, [user.username, hashed, user.role], function (err) {
      cb(err, this && this.lastID);
    });
  },

  verifyCredentials(username, password, cb) {
    this.findByUsername(username, (err, user) => {
      if (err) return cb(err);
      if (!user) return cb(null, null);
      const ok = bcrypt.compareSync(password, user.password);
      cb(null, ok ? user : null);
    });
  }
};

module.exports = userModel;
