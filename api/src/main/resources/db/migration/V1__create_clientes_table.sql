CREATE TABLE clientes (
    id                  UUID            PRIMARY KEY,
    nombre              VARCHAR(120)    NOT NULL,
    telefono            VARCHAR(30)     NOT NULL UNIQUE,
    codigo_referido     VARCHAR(20)     NOT NULL UNIQUE,
    contador_fidelidad  INTEGER         NOT NULL DEFAULT 0
);

CREATE INDEX idx_clientes_telefono ON clientes (telefono);
CREATE INDEX idx_clientes_codigo_referido ON clientes (codigo_referido);
