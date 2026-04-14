const petModel = require('../models/petModel');
const ownerModel = require('../models/ownerModel');
const db = require('../config/db');

// Listar todas las mascotas
exports.getAllPets = (req, res) => {
    petModel.getAll((err, pets) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.render('pets/list', { 
            title: 'Gestión de Mascotas', 
            pets: pets || [],
            user: req.session.user 
        });
    });
};

// Mostrar formulario para crear mascota
exports.getCreateForm = (req, res) => {
    ownerModel.getAll((err, owners) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        if (!owners || owners.length === 0) {
            return res.render('pets/create', { 
                title: 'Crear Mascota', 
                owners: [], 
                message: 'Primero debe crear un dueño',
                user: req.session.user,
                error: null
            });
        }
        res.render('pets/create', { 
            title: 'Crear Mascota', 
            owners: owners,
            user: req.session.user,
            error: null,
            message: null
        });
    });
};

// Crear mascota (con validación de owner_id)
exports.createPet = (req, res) => {
    const { name, owner_id } = req.body;
    
    if (!name || !owner_id) {
        return res.status(400).send('Nombre y dueño son obligatorios');
    }

    petModel.create({ name, owner_id }, (err, id) => {
        if (err) {
            ownerModel.getAll((getErr, owners) => {
                return res.status(400).render('pets/create', { 
                    title: 'Crear Mascota',
                    error: err.message,
                    owners: owners || [],
                    user: req.session.user 
                });
            });
            return;
        }
        res.redirect('/pets');
    });
};

// Mostrar formulario para editar mascota
exports.getEditForm = (req, res) => {
    const petId = req.params.id;
    
    db.get("SELECT * FROM pets WHERE id = ? LIMIT 1", [petId], (err, pet) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        if (!pet) return res.status(404).send('Mascota no encontrada');
        
        ownerModel.getAll((ownerErr, owners) => {
            if (ownerErr) return res.status(500).send('Error: ' + ownerErr.message);
            res.render('pets/edit', { 
                title: 'Editar Mascota', 
                pet: pet,
                owners: owners,
                user: req.session.user 
            });
        });
    });
};

// Actualizar mascota
exports.updatePet = (req, res) => {
    const petId = req.params.id;
    const { name, owner_id } = req.body;
    
    if (!name || !owner_id) {
        return res.status(400).send('Nombre y dueño son obligatorios');
    }

    petModel.updateById(petId, { name, owner_id }, (err) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.redirect('/pets');
    });
};

// Eliminar mascota
exports.deletePet = (req, res) => {
    const petId = req.params.id;
    petModel.deleteById(petId, (err) => {
        if (err) return res.status(500).send('Error: ' + err.message);
        res.redirect('/pets');
    });
};
