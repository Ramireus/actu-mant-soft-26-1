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

    // Actualizar campos médicos completos (diagnóstico, peso, temperatura, medicina)
    updateMedicalFieldsById(id, medicalData, callback) {
        const sql = `
            UPDATE appointments
            SET diagnosis = ?, weight = ?, temperature = ?, is_medical_consultation = ?, medicine = ?, medical_notes = ?
            WHERE id = ?
        `;
        db.run(sql, [medicalData.diagnosis, medicalData.weight, medicalData.temperature, medicalData.is_medical_consultation, medicalData.medicine, medicalData.medical_notes, id], function (err) {
            callback(err, this && this.changes);
        });
    },

    deleteById(id, callback) {
        const sql = "DELETE FROM appointments WHERE id = ?";
        db.run(sql, id, function (err) {
            callback(err, this && this.changes);
        });
    },

    // Obtener todas las citas de una mascota (para historial)
    getByPetId(petId, callback) {
        const sql = `
            SELECT a.*, o.name as owner_name
            FROM appointments a
            LEFT JOIN pets p ON a.pet_id = p.id
            LEFT JOIN owners o ON p.owner_id = o.id
            WHERE a.pet_id = ?
            ORDER BY a.appointment_date DESC
        `;
        db.all(sql, [petId], (err, rows) => callback(err, rows));
    }
};

module.exports = appointmentModel;
