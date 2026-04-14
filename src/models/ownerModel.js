const db = require('../config/db');

const ownerModel = {
    // Obtener todos los dueños
    getAll(callback) {
        const sql = "SELECT id, name FROM owners ORDER BY name ASC";
        db.all(sql, [], (err, rows) => callback(err, rows));
    },

    // Obtener dueño por ID
    getById(id, callback) {
        const sql = "SELECT id, name FROM owners WHERE id = ? LIMIT 1";
        db.get(sql, [id], (err, row) => callback(err, row));
    },

    // Crear dueño (validar nombre único)
    create(owner, callback) {
        const sql = "INSERT INTO owners (name) VALUES (?)";
        db.run(sql, [owner.name], function (err) {
            if (err && err.message.includes('UNIQUE')) {
                return callback(new Error('El dueño ya existe'));
            }
            callback(err, this && this.lastID);
        });
    },

    // Actualizar dueño
    updateById(id, owner, callback) {
        const sql = "UPDATE owners SET name = ? WHERE id = ?";
        db.run(sql, [owner.name, id], function (err) {
            callback(err, this && this.changes);
        });
    },

    // Eliminar dueño (solo si no tiene mascotas)
    deleteById(id, callback) {
        const checkSql = "SELECT COUNT(*) as count FROM pets WHERE owner_id = ?";
        db.get(checkSql, [id], (err, row) => {
            if (err) return callback(err);
            if (row.count > 0) {
                return callback(new Error('No se puede eliminar: el dueño tiene mascotas asociadas'));
            }
            const sql = "DELETE FROM owners WHERE id = ?";
            db.run(sql, id, function (err) {
                callback(err, this && this.changes);
            });
        });
    }
};

module.exports = ownerModel;
