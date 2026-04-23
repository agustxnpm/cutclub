package com.cutclub.api.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad de dominio que representa un corte realizado a un cliente.
 */
public record Corte(
        UUID id,
        UUID clienteId,
        String tipoCorte,
        BigDecimal precio,
        LocalDateTime fecha,
        boolean esGratis
) {
    public Corte {
        if (id == null) id = UUID.randomUUID();
        if (fecha == null) fecha = LocalDateTime.now();
        if (clienteId == null) throw new IllegalArgumentException("El clienteId no puede ser nulo");
        if (tipoCorte == null || tipoCorte.isBlank()) throw new IllegalArgumentException("El tipoCorte es obligatorio");
        if (precio == null || precio.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("El precio debe ser mayor o igual a 0");
    }
}
