const db = require('../config/db');

const appointmentModel = {
    getAll(callback) {
        const sql = "SELECT * FROM appointments ORDER BY appointment_date DESC";
        db.all(sql, [], (err, rows) => callback(err, rows));
    },

    getById(id, callback) {
        const sql = "SELECT * FROM appointments WHERE id = ? LIMIT 1";
        db.get(sql, [id], (err, row) => callback(err, row));
    },

    create(appointment, callback) {
        const sql = "INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)";
        const params = [appointment.pet_name, appointment.owner_name, appointment.service, appointment.appointment_date];
        db.run(sql, params, function (err) {
            callback(err, this && this.lastID);
        });
    },

    updateMedicalById(id, medical_notes, callback) {
        const sql = "UPDATE appointments SET medical_notes = ? WHERE id = ?";
        db.run(sql, [medical_notes, id], function (err) {
            callback(err, this && this.changes);
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
