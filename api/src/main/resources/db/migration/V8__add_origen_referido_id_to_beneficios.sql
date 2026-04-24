-- Migración: Agrega el campo origen_referido_id a la tabla beneficios.
-- Permite registrar qué cliente referido originó un beneficio de tipo REFERIDO,
-- para poder mostrar al referente "Ganado por referir a <nombre>" en el frontend.

ALTER TABLE beneficios
    ADD COLUMN origen_referido_id UUID REFERENCES clientes(id) ON DELETE SET NULL;
