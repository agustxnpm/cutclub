-- HU 3.2: Tabla para almacenar los vínculos de referidos
CREATE TABLE referidos (
    id          UUID        NOT NULL PRIMARY KEY,
    referente_id UUID       NOT NULL REFERENCES clientes(id),
    referido_id  UUID       NOT NULL REFERENCES clientes(id),
    estado       VARCHAR(30) NOT NULL DEFAULT 'PENDING_VALIDATION',
    CONSTRAINT uq_referido_id UNIQUE (referido_id)
);
