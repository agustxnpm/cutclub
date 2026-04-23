package com.cutclub.api.infrastructure.web.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CorteResponse(
        UUID id,
        String tipoCorte,
        BigDecimal precio,
        LocalDateTime fecha,
        boolean esGratis
) {
}
