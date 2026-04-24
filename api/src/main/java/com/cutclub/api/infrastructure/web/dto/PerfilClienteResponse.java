package com.cutclub.api.infrastructure.web.dto;

import java.util.List;
import java.util.UUID;

public record PerfilClienteResponse(
        UUID id,
        String nombre,
        String telefono,
        String codigoReferido,
        int contadorFidelidad,
        CorteResponse ultimoCorte,
        List<BeneficioResponse> beneficiosDisponibles,
        boolean esReferidoPendiente,
        String nombreReferente
) {
}
