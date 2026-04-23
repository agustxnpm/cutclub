package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record RegistrarCorteRequest(
        @NotNull(message = "El clienteId es obligatorio")
        UUID clienteId,

        @NotBlank(message = "El tipoCorte es obligatorio")
        String tipoCorte,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.0", inclusive = true, message = "El precio debe ser mayor o igual a 0")
        BigDecimal precio
) {}
