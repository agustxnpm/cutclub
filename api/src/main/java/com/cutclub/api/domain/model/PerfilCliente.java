package com.cutclub.api.domain.model;

import java.util.List;

/**
 * Value Object que consolida el perfil completo de un cliente:
 * sus datos, su último corte, el historial completo de cortes y sus beneficios disponibles (activos).
 */
public record PerfilCliente(
        Cliente cliente,
        Corte ultimoCorte,
        List<Corte> historialCortes,
        List<Beneficio> beneficiosDisponibles
) {
    public PerfilCliente {
        if (cliente == null) throw new IllegalArgumentException("El cliente es obligatorio");
        historialCortes = historialCortes != null
                ? List.copyOf(historialCortes)
                : List.of();
        beneficiosDisponibles = beneficiosDisponibles != null
                ? List.copyOf(beneficiosDisponibles)
                : List.of();
    }
}
