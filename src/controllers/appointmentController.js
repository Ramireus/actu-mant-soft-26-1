const appointmentModel = require('../models/appointmentModel');

exports.getAllAppointments = (req, res) => {
    appointmentModel.getAll((err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.render('index', { title: 'Panel de Citas', appointments: rows });
    });
};

exports.getCreateForm = (req, res) => {
    res.render('create', { title: 'Agendar Nueva Cita' });
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
        res.render('edit_medical', { title: 'Editar Historial Médico', appointment });
    });
};

exports.updateMedical = (req, res) => {
    const id = req.params.id;
    const { medical_notes } = req.body;
    appointmentModel.updateMedicalById(id, medical_notes, (err) => {
        if (err) return res.status(500).send(err.message);
        res.redirect('/');
    });
};
