const appointmentModel = require('../models/appointmentModel');

exports.getAllAppointments = (req, res) => {
    appointmentModel.getAll((err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.render('index', { title: 'Panel de Citas', appointments: rows, user: req.session.user });
    });
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita', user: req.session.user });
};

exports.createAppointment = (req, res) => {
    const { pet_name, owner_name, service, appointment_date } = req.body;
    appointmentModel.create({ pet_name, owner_name, service, appointment_date }, (err, id) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};

exports.deleteAppointment = (req, res) => {
    const id = req.params.id;
    appointmentModel.deleteById(id, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.redirect('/');
    });
};

// Nuevos handlers para editar historial médico
exports.getEditMedicalForm = (req, res) => {
    const id = req.params.id;
    appointmentModel.getById(id, (err, appointment) => {
        if (err) return res.status(500).send(err.message);
        if (!appointment) return res.status(404).send('Cita no encontrada');
        res.render('edit_medical', { title: 'Editar Datos Médicos', appointment, user: req.session.user, error: null });
    });
};

exports.updateMedical = (req, res) => {
    const id = req.params.id;
    const is_medical_consultation = req.body.is_medical_consultation === 'on' ? 1 : 0;

    // Validación condicional: si es consulta médica, peso, temperatura y diagnóstico son requeridos
    if (is_medical_consultation) {
        const missingFields = [];
        if (!req.body.weight || req.body.weight.toString().trim() === '') missingFields.push('Peso');
        if (!req.body.temperature || req.body.temperature.toString().trim() === '') missingFields.push('Temperatura');
        if (!req.body.diagnosis || req.body.diagnosis.trim() === '') missingFields.push('Diagnóstico');

        if (missingFields.length > 0) {
            appointmentModel.getById(id, (err, appointment) => {
                if (err) return res.status(500).send(err.message);
                return res.status(400).render('edit_medical', { 
                    title: 'Editar Datos Médicos', 
                    appointment, 
                    error: `Los siguientes campos son obligatorios en consultas médicas: ${missingFields.join(', ')}`,
                    user: req.session.user 
                });
            });
            return;
        }
    }

    const medicalData = {
        diagnosis: req.body.diagnosis || '',
        weight: req.body.weight ? parseFloat(req.body.weight) : null,
        temperature: req.body.temperature ? parseFloat(req.body.temperature) : null,
        is_medical_consultation: is_medical_consultation,
        medicine: req.body.medicine || '',
        medical_notes: req.body.medical_notes || ''
    };
    appointmentModel.updateMedicalFieldsById(id, medicalData, (err) => {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};
