const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { ensureAuthenticated, ensureRole, ensureCanEditMedical } = require('../middleware/authMiddleware');

router.get('/', appointmentController.getAllAppointments);
router.get('/create', ensureAuthenticated, appointmentController.getCreateForm);
router.post('/create', ensureAuthenticated, appointmentController.createAppointment);
// delete: ahora sólo requiere usuario autenticado (criterio 2)
router.post('/delete/:id', ensureAuthenticated, appointmentController.deleteAppointment);

// Rutas para editar historial médico (criterio 1)
router.get('/medical/:id', ensureCanEditMedical, appointmentController.getEditMedicalForm);
router.post('/medical/:id', ensureCanEditMedical, appointmentController.updateMedical);

module.exports = router;
