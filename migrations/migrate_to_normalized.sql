-- Migration: Normalizar appointments -> owners, pets
BEGIN TRANSACTION;
PRAGMA foreign_keys = ON;

-- 1) Crear tablas nuevas
CREATE TABLE IF NOT EXISTS owners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    owner_id INTEGER NOT NULL,
    UNIQUE(name, owner_id),
    FOREIGN KEY(owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

-- 2) Agregar columna pet_id a appointments si no existe
ALTER TABLE appointments ADD COLUMN pet_id INTEGER;

-- 3) Poblar owners con los owner_name existentes
INSERT OR IGNORE INTO owners(name)
SELECT DISTINCT owner_name FROM appointments WHERE owner_name IS NOT NULL;

-- 4) Poblar pets vinculando cada pet_name con su owner
INSERT OR IGNORE INTO pets(name, owner_id)
SELECT a.pet_name, o.id
FROM appointments a
JOIN owners o ON o.name = a.owner_name
WHERE a.pet_name IS NOT NULL;

-- 5) Rellenar appointments.pet_id
UPDATE appointments
SET pet_id = (
  SELECT p.id
  FROM pets p
  JOIN owners o ON p.owner_id = o.id
  WHERE p.name = appointments.pet_name
    AND o.name = appointments.owner_name
  LIMIT 1
)
WHERE pet_id IS NULL;

-- 6) Crear trigger para futuros inserts
CREATE TRIGGER IF NOT EXISTS trg_after_insert_appointments
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
END;

COMMIT;
