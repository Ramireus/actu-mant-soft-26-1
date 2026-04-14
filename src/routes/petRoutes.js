const express = require('express');
const petController = require('../controllers/petController');
const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /pets - Listar todas las mascotas (Recepcionista)
router.get('/', ensureAuthenticated, ensureRole('Recepcionista'), petController.getAllPets);

// GET /pets/create - Formulario crear mascota
router.get('/create', ensureAuthenticated, ensureRole('Recepcionista'), petController.getCreateForm);

// POST /pets/create - Crear mascota
router.post('/create', ensureAuthenticated, ensureRole('Recepcionista'), petController.createPet);

// GET /pets/edit/:id - Formulario editar mascota
router.get('/edit/:id', ensureAuthenticated, ensureRole('Recepcionista'), petController.getEditForm);

// POST /pets/edit/:id - Actualizar mascota
router.post('/edit/:id', ensureAuthenticated, ensureRole('Recepcionista'), petController.updatePet);

// POST /pets/delete/:id - Eliminar mascota
router.post('/delete/:id', ensureAuthenticated, ensureRole('Recepcionista'), petController.deletePet);

module.exports = router;
