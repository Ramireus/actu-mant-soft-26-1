const db = require('../config/db');

const appointmentModel = {
    getAll(callback) {
        const sql = "SELECT * FROM appointments ORDER BY appointment_date DESC";
        db.all(sql, [], (err, rows) => callback(err, rows));
    },

    create(appointment, callback) {
        const sql = "INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)";
        const params = [appointment.pet_name, appointment.owner_name, appointment.service, appointment.appointment_date];
        db.run(sql, params, function (err) {
            callback(err, this && this.lastID);
        });
    },

    deleteById(id, callback) {
        const sql = "DELETE FROM appointments WHERE id = ?";
        db.run(sql, id, function (err) {
            callback(err, this && this.changes);
        });
    }
};

module.exports = appointmentModel;
