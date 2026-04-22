package com.cutclub.api.infrastructure.web.dto;

import java.util.UUID;

public record AuthClienteResponse(
        UUID clienteId,
        String nombre,
        String telefono
) {
}
