const express = require('express');
const ownerController = require('../controllers/ownerController');
const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /owners - Listar todos los dueños (Recepcionista)
router.get('/', ensureAuthenticated, ensureRole('Recepcionista'), ownerController.getAllOwners);

// GET /owners/create - Formulario crear dueño
router.get('/create', ensureAuthenticated, ensureRole('Recepcionista'), ownerController.getCreateForm);

// POST /owners/create - Crear dueño
router.post('/create', ensureAuthenticated, ensureRole('Recepcionista'), ownerController.createOwner);

// GET /owners/edit/:id - Formulario editar dueño
router.get('/edit/:id', ensureAuthenticated, ensureRole('Recepcionista'), ownerController.getEditForm);

// POST /owners/edit/:id - Actualizar dueño
router.post('/edit/:id', ensureAuthenticated, ensureRole('Recepcionista'), ownerController.updateOwner);

// POST /owners/delete/:id - Eliminar dueño
router.post('/delete/:id', ensureAuthenticated, ensureRole('Recepcionista'), ownerController.deleteOwner);

module.exports = router;
