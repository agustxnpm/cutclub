package com.cutclub.api.infrastructure.web.dto;

import java.util.UUID;

public record ClienteResponse(
        UUID id,
        String nombre,
        String telefono,
        String codigoReferido,
        int contadorFidelidad
) {
}
