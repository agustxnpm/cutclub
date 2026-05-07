-- La autenticación se delega completamente a la tabla `usuarios`.
-- La columna contrasena_hash en `clientes` queda obsoleta tras la migración V10.
ALTER TABLE clientes DROP COLUMN IF EXISTS contrasena_hash;
