-- Migración: Normalizar columna 'tipo' de beneficios al enum TipoBeneficio (FIDELIZACION, REFERIDO).
-- La columna originalmente era VARCHAR libre. Ahora debe usar solo los valores del enum.
-- Si existen beneficios con valores incorrectos ('AVAILABLE', etc.) los corregimos a FIDELIZACION
-- ya que todos los beneficios generados hasta ahora son por fidelización.

UPDATE beneficios
SET tipo = 'FIDELIZACION'
WHERE tipo NOT IN ('FIDELIZACION', 'REFERIDO');
