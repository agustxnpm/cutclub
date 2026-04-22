package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LoginClienteRequest(

        @NotBlank(message = "El teléfono es obligatorio")
        @Size(min = 5, max = 30, message = "El teléfono debe tener entre 5 y 30 caracteres")
        @Pattern(regexp = "^[0-9]+$", message = "El teléfono debe contener solo números")
        String telefono,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 4, max = 100, message = "La contraseña debe tener entre 4 y 100 caracteres")
        String contrasena
) {
}
