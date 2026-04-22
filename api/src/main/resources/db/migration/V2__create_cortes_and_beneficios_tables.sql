CREATE TABLE cortes (
    id          UUID            PRIMARY KEY,
    cliente_id  UUID            NOT NULL,
    fecha       TIMESTAMP       NOT NULL,
    tipo        VARCHAR(50),
    notas       VARCHAR(255),
    CONSTRAINT fk_corte_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE INDEX idx_cortes_cliente_id ON cortes (cliente_id);
CREATE INDEX idx_cortes_fecha ON cortes (fecha DESC);

CREATE TABLE beneficios (
    id              UUID            PRIMARY KEY,
    cliente_id      UUID            NOT NULL,
    tipo            VARCHAR(30)     NOT NULL,
    activo          BOOLEAN         NOT NULL DEFAULT true,
    fecha_creacion  TIMESTAMP       NOT NULL,
    CONSTRAINT fk_beneficio_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE INDEX idx_beneficios_cliente_id ON beneficios (cliente_id);
