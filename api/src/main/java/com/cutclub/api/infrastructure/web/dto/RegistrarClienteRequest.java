package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrarClienteRequest(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 2, max = 120, message = "El nombre debe tener entre 2 y 120 caracteres")
        String nombre,

        @NotBlank(message = "El teléfono es obligatorio")
        @Size(min = 5, max = 30, message = "El teléfono debe tener entre 5 y 30 caracteres")
        @Pattern(regexp = "^[0-9]+$", message = "El teléfono debe contener solo números")
        String telefono
) {
}
