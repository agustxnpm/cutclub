package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El teléfono es obligatorio") String telefono,
        @NotBlank(message = "La contraseña es obligatoria") String contrasena
) {
}
