const medicalRecordModel = require('../models/medicalRecordModel');
const appointmentModel = require('../models/appointmentModel');

// Vista: Historial clínico de una mascota (solo lectura, cronológico)
exports.getMedicalHistory = (req, res) => {
    const petId = req.params.petId;
    
    // Primero obtener info de mascota/propietario
    const db = require('../config/db');
    db.get(`
        SELECT p.id, p.name as pet_name, o.name as owner_name
        FROM pets p
        LEFT JOIN owners o ON p.owner_id = o.id
        WHERE p.id = ?
        LIMIT 1
    `, [petId], (err, petInfo) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        if (!petInfo) return res.status(404).send('Mascota no encontrada');
        
        // Luego obtener registros médicos
        medicalRecordModel.getFullHistoryByPetId(petId, (err, records) => {
            if (err) return res.status(500).send('Error al cargar historial: ' + err.message);
            
            res.render('medical_history', {
                title: `Historial Clínico - ${petInfo.pet_name}`,
                pet_name: petInfo.pet_name,
                owner_name: petInfo.owner_name || 'Propietario desconocido',
                petId: petId,
                records: records || [],
                message: records && records.length === 0 ? 'No hay registros médicos para esta mascota.' : null,
                user: req.session.user
            });
        });
    });
};

// Vista: Detalle de un registro médico específico (solo lectura)
exports.getMedicalRecordDetail = (req, res) => {
    const recordId = req.params.recordId;
    medicalRecordModel.getById(recordId, (err, record) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        if (!record) return res.status(404).send('Registro no encontrado');
        res.render('medical_record_detail', {
            title: 'Detalle de Registro Médico',
            record: record,
            user: req.session.user
        });
    });
};

// Handler: Crear registro médico desde cita
exports.createMedicalRecord = (req, res) => {
    const appointmentId = req.params.appointmentId;
    appointmentModel.getById(appointmentId, (err, appointment) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        if (!appointment) return res.status(404).send('Cita no encontrada');

        const record = {
            appointment_id: appointmentId,
            pet_id: appointment.pet_id,
            diagnosis: req.body.diagnosis || '',
            weight: req.body.weight || null,
            medicine: req.body.medicine || '',
            notes: req.body.notes || '',
            recorded_by: req.session.user.id
        };

        medicalRecordModel.create(record, (err, recordId) => {
            if (err) return res.status(500).send('Error al crear registro: ' + err.message);
            res.redirect(`/medical/history/${appointment.pet_id}`);
        });
    });
};
