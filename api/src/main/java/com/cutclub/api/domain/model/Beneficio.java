package com.cutclub.api.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad de dominio que representa un beneficio otorgado a un cliente
 * (por fidelización o referido). Un beneficio activo puede ser canjeado una sola vez.
 */
public record Beneficio(
        UUID id,
        UUID clienteId,
        String tipo,
        boolean activo,
        LocalDateTime fechaCreacion
) {
    public Beneficio {
        if (id == null) throw new IllegalArgumentException("El id del beneficio no puede ser nulo");
        if (clienteId == null) throw new IllegalArgumentException("El clienteId no puede ser nulo");
        if (tipo == null || tipo.isBlank()) throw new IllegalArgumentException("El tipo de beneficio es obligatorio");
        if (fechaCreacion == null) throw new IllegalArgumentException("La fecha de creación es obligatoria");
    }
}
