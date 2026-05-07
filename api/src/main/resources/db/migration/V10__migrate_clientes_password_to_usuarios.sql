-- Migra las contraseñas existentes desde clientes.contrasena_hash hacia la nueva tabla usuarios.
-- Cada cliente con contraseña obtiene una identidad Usuario con rol CLIENTE y comparte el mismo id
-- (simplifica la trazabilidad: el id del Usuario y el del Cliente coinciden por convención).
INSERT INTO usuarios (id, telefono, password_hash, activo)
SELECT c.id, c.telefono, c.contrasena_hash, TRUE
FROM clientes c
WHERE c.contrasena_hash IS NOT NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO usuario_roles (usuario_id, rol)
SELECT c.id, 'CLIENTE'
FROM clientes c
WHERE c.contrasena_hash IS NOT NULL
ON CONFLICT DO NOTHING;
