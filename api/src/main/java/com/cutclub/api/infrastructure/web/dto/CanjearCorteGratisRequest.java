package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CanjearCorteGratisRequest(
        @NotNull(message = "El clienteId es obligatorio")
        UUID clienteId,

        @NotNull(message = "El beneficioId es obligatorio")
        UUID beneficioId,

        @NotBlank(message = "El tipoCorte es obligatorio")
        String tipoCorte
) {}
