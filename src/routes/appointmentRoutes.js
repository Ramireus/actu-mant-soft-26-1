const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const medicalRecordController = require('../controllers/medicalRecordController');
const { ensureAuthenticated, ensureCanEditMedical } = require('../middleware/authMiddleware');

router.get('/', appointmentController.getAllAppointments);
router.get('/create', ensureAuthenticated, appointmentController.getCreateForm);
router.post('/create', ensureAuthenticated, appointmentController.createAppointment);
router.post('/delete/:id', ensureAuthenticated, appointmentController.deleteAppointment);

// Rutas médicas
router.get('/medical/:id', ensureCanEditMedical, appointmentController.getEditMedicalForm);
router.post('/medical/:id', ensureCanEditMedical, appointmentController.updateMedical);

// Rutas historial clínico (criterio 1 y 2: solo lectura, cronológico)
router.get('/medical/history/:petId', ensureAuthenticated, medicalRecordController.getMedicalHistory);
router.get('/medical/record/:recordId', ensureAuthenticated, medicalRecordController.getMedicalRecordDetail);
router.post('/medical/record/:appointmentId', ensureCanEditMedical, medicalRecordController.createMedicalRecord);

module.exports = router;
