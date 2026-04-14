const ownerModel = require('../models/ownerModel');

// Listar todos los dueños
exports.getAllOwners = (req, res) => {
    ownerModel.getAll((err, owners) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.render('owners/list', { 
            title: 'Gestión de Dueños', 
            owners: owners || [],
            user: req.session.user 
        });
    });
};

// Mostrar formulario para crear dueño
exports.getCreateForm = (req, res) => {
    res.render('owners/create', { 
        title: 'Crear Dueño',
        user: req.session.user,
        error: null
    });
};

// Crear dueño
exports.createOwner = (req, res) => {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
        return res.status(400).send('El nombre del dueño es obligatorio');
    }

    ownerModel.create({ name: name.trim() }, (err, id) => {
        if (err) {
            return res.status(400).render('owners/create', { 
                title: 'Crear Dueño',
                error: err.message,
                user: req.session.user 
            });
        }
        res.redirect('/owners');
    });
};

// Mostrar formulario para editar dueño
exports.getEditForm = (req, res) => {
    const ownerId = req.params.id;
    ownerModel.getById(ownerId, (err, owner) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        if (!owner) return res.status(404).send('Dueño no encontrado');
        res.render('owners/edit', { 
            title: 'Editar Dueño', 
            owner: owner,
            user: req.session.user 
        });
    });
};

// Actualizar dueño
exports.updateOwner = (req, res) => {
    const ownerId = req.params.id;
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
        return res.status(400).send('El nombre del dueño es obligatorio');
    }

    ownerModel.updateById(ownerId, { name: name.trim() }, (err) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.redirect('/owners');
    });
};

// Eliminar dueño
exports.deleteOwner = (req, res) => {
    const ownerId = req.params.id;
    ownerModel.deleteById(ownerId, (err) => {
        if (err) {
            return res.status(400).send('Error: ' + err.message);
        }
        res.redirect('/owners');
    });
};
