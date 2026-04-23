-- Migración: Adaptación de la tabla beneficios para soportar el modelo de EstadoBeneficio.
-- Se reemplaza la columna booleana 'activo' por la columna 'estado' (enum como VARCHAR)
-- y se convierte 'tipo' para almacenar los valores del enum EstadoBeneficio.

ALTER TABLE beneficios
    ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE';

-- Migrar datos existentes: activo=true → AVAILABLE, activo=false → USED
UPDATE beneficios SET estado = 'USED' WHERE activo = false;

ALTER TABLE beneficios
    DROP COLUMN activo;

-- Agregar índice para consultas por cliente y estado
CREATE INDEX idx_beneficios_estado ON beneficios (cliente_id, estado);
