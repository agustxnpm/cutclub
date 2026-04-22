package com.cutclub.api.infrastructure.web.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CorteResponse(
        UUID id,
        LocalDateTime fecha,
        String tipo,
        String notas
) {
}
