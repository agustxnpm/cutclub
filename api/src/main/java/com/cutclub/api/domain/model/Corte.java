package com.cutclub.api.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad de dominio que representa un corte realizado a un cliente.
 */
public record Corte(
        UUID id,
        UUID clienteId,
        LocalDateTime fecha,
        String tipo,
        String notas
) {
    public Corte {
        if (id == null) throw new IllegalArgumentException("El id del corte no puede ser nulo");
        if (clienteId == null) throw new IllegalArgumentException("El clienteId no puede ser nulo");
        if (fecha == null) throw new IllegalArgumentException("La fecha del corte es obligatoria");
    }
}
