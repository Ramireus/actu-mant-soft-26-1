const db = require('../config/db');

const medicalRecordModel = {
    // Obtener todos los registros de una mascota (cronología)
    getByPetId(petId, callback) {
        const sql = `
            SELECT mr.*, u.username, p.name as pet_name, o.name as owner_name
            FROM medical_records mr
            LEFT JOIN users u ON mr.recorded_by = u.id
            LEFT JOIN pets p ON mr.pet_id = p.id
            LEFT JOIN owners o ON p.owner_id = o.id
            WHERE mr.pet_id = ?
            ORDER BY mr.created_at DESC
        `;
        db.all(sql, [petId], (err, rows) => callback(err, rows));
    },

    // Obtener un registro específico
    getById(recordId, callback) {
        const sql = `
            SELECT mr.*, u.username, p.name as pet_name, o.name as owner_name
            FROM medical_records mr
            LEFT JOIN users u ON mr.recorded_by = u.id
            LEFT JOIN pets p ON mr.pet_id = p.id
            LEFT JOIN owners o ON p.owner_id = o.id
            WHERE mr.id = ?
            LIMIT 1
        `;
        db.get(sql, [recordId], (err, row) => callback(err, row));
    },

    // Crear nuevo registro médico
    create(record, callback) {
        const sql = `
            INSERT INTO medical_records (appointment_id, pet_id, diagnosis, weight, temperature, is_medical_consultation, medicine, notes, recorded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [record.appointment_id, record.pet_id, record.diagnosis, record.weight, record.temperature, record.is_medical_consultation ? 1 : 0, record.medicine, record.notes, record.recorded_by], function (err) {
            callback(err, this && this.lastID);
        });
    },

    // Actualizar registro médico
    updateById(recordId, record, callback) {
        const sql = `
            UPDATE medical_records
            SET diagnosis = ?, weight = ?, temperature = ?, is_medical_consultation = ?, medicine = ?, notes = ?
            WHERE id = ?
        `;
        db.run(sql, [record.diagnosis, record.weight, record.temperature, record.is_medical_consultation ? 1 : 0, record.medicine, record.notes, recordId], function (err) {
            callback(err, this && this.changes);
        });
    },

    // Obtener historial clínico completo de una mascota con detalles
    getFullHistoryByPetId(petId, callback) {
        const sql = `
            SELECT 
                mr.id, mr.appointment_id, mr.diagnosis, mr.weight, mr.temperature, mr.is_medical_consultation, mr.medicine, mr.notes,
                mr.created_at, u.username as recorded_by,
                a.pet_name, a.owner_name, a.service, a.appointment_date,
                p.id as pet_id, o.name as owner_name
            FROM medical_records mr
            LEFT JOIN appointments a ON mr.appointment_id = a.id
            LEFT JOIN users u ON mr.recorded_by = u.id
            LEFT JOIN pets p ON mr.pet_id = p.id
            LEFT JOIN owners o ON p.owner_id = o.id
            WHERE mr.pet_id = ?
            ORDER BY mr.created_at DESC
        `;
        db.all(sql, [petId], (err, rows) => callback(err, rows));
    }
};

module.exports = medicalRecordModel;
