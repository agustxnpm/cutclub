package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.NotNull;

public record ValidarReferidoRequest(
        @NotNull(message = "El campo esNuevoReal es obligatorio")
        Boolean esNuevoReal
) {
}
