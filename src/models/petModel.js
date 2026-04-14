const db = require('../config/db');

const petModel = {
    // Obtener todas las mascotas
    getAll(callback) {
        const sql = `
            SELECT p.id, p.name, o.id as owner_id, o.name as owner_name
            FROM pets p
            LEFT JOIN owners o ON p.owner_id = o.id
            ORDER BY p.name ASC
        `;
        db.all(sql, [], (err, rows) => callback(err, rows));
    },

    // Obtener mascotas por dueño
    getByOwnerId(ownerId, callback) {
        const sql = `
            SELECT p.id, p.name, o.id as owner_id, o.name as owner_name
            FROM pets p
            LEFT JOIN owners o ON p.owner_id = o.id
            WHERE p.owner_id = ?
            ORDER BY p.name ASC
        `;
        db.all(sql, [ownerId], (err, rows) => callback(err, rows));
    },

    // Crear mascota (VALIDAR que owner exista)
    create(pet, callback) {
        // Primero verificar que el owner exista
        const checkOwnerSql = "SELECT id FROM owners WHERE id = ? LIMIT 1";
        db.get(checkOwnerSql, [pet.owner_id], (err, owner) => {
            if (err) return callback(err);
            if (!owner) return callback(new Error('El dueño no existe'));

            // Si existe, crear mascota
            const sql = "INSERT INTO pets (name, owner_id) VALUES (?, ?)";
            db.run(sql, [pet.name, pet.owner_id], function (err) {
                callback(err, this && this.lastID);
            });
        });
    },

    // Actualizar mascota
    updateById(id, pet, callback) {
        const sql = "UPDATE pets SET name = ?, owner_id = ? WHERE id = ?";
        db.run(sql, [pet.name, pet.owner_id, id], function (err) {
            callback(err, this && this.changes);
        });
    },

    // Eliminar mascota
    deleteById(id, callback) {
        const sql = "DELETE FROM pets WHERE id = ?";
        db.run(sql, id, function (err) {
            callback(err, this && this.changes);
        });
    }
};

module.exports = petModel;
