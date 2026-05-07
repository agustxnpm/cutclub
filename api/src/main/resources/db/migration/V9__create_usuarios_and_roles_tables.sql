-- Tabla principal de identidades autenticables (Usuario)
CREATE TABLE usuarios (
    id              UUID            PRIMARY KEY,
    telefono        VARCHAR(30)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    activo          BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_usuarios_telefono ON usuarios (telefono);

-- Tabla de roles asociados (relación N a M con enum embebido)
CREATE TABLE usuario_roles (
    usuario_id  UUID            NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
    rol         VARCHAR(20)     NOT NULL,
    PRIMARY KEY (usuario_id, rol)
);

CREATE INDEX idx_usuario_roles_usuario ON usuario_roles (usuario_id);
