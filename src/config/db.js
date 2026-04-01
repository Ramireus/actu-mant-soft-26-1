const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
// Use in-memory DB for dev; change ':memory:' to a file path for persistence (e.g. './data/app.db')
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
        // Enable foreign keys
        db.run("PRAGMA foreign_keys = ON");

        // Owners table (new)
        db.run(`CREATE TABLE IF NOT EXISTS owners (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
        )`);

        // Pets table (new)
        db.run(`CREATE TABLE IF NOT EXISTS pets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                owner_id INTEGER NOT NULL,
                UNIQUE(name, owner_id),
                FOREIGN KEY(owner_id) REFERENCES owners(id) ON DELETE CASCADE
        )`);

                // Appointments table (kept for backwards compatibility) with new pet_id column and medical notes
                db.run(`CREATE TABLE IF NOT EXISTS appointments (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        pet_name TEXT NOT NULL,
                                        owner_name TEXT NOT NULL,
                                        service TEXT NOT NULL,
                                        appointment_date TEXT NOT NULL,
                                        status TEXT DEFAULT 'Scheduled',
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        pet_id INTEGER,
                                        medical_notes TEXT DEFAULT ''
                )`);

        // Users table for authentication
        db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL
        )`);

        // Seed default users (Veterinario and Recepcionista)
        const vetPass = bcrypt.hashSync('vetpass', 8);
        const recPass = bcrypt.hashSync('recpass', 8);
        db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, ['vet@example.com', vetPass, 'Veterinario']);
        db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, ['rec@example.com', recPass, 'Recepcionista']);

        // Trigger: after inserting into appointments, ensure owner and pet exist and set pet_id
        db.run(`CREATE TRIGGER IF NOT EXISTS trg_after_insert_appointments
        AFTER INSERT ON appointments
        FOR EACH ROW
        BEGIN
                INSERT OR IGNORE INTO owners(name) VALUES (NEW.owner_name);
                INSERT OR IGNORE INTO pets(name, owner_id)
                        SELECT NEW.pet_name, owners.id FROM owners WHERE owners.name = NEW.owner_name;
                UPDATE appointments
                SET pet_id = (
                        SELECT p.id
                        FROM pets p
                        JOIN owners o ON p.owner_id = o.id
                        WHERE p.name = NEW.pet_name AND o.name = NEW.owner_name
                        LIMIT 1
                )
                WHERE id = NEW.id;
        END;`);

        // Add some initial dummy data (will fire trigger and populate owners/pets)
        const stmt = db.prepare("INSERT INTO appointments (pet_name, owner_name, service, appointment_date) VALUES (?, ?, ?, ?)");
        stmt.run("Rex", "Juan Pérez", "Corte de Pelo", "2026-02-25 10:00");
        stmt.run("Luna", "Maria García", "Baño y Limpieza", "2026-02-25 11:30");
        stmt.finalize();
});

module.exports = db;
