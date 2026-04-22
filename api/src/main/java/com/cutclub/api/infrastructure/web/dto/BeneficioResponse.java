package com.cutclub.api.infrastructure.web.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record BeneficioResponse(
        UUID id,
        String tipo,
        LocalDateTime fechaCreacion
) {
}
