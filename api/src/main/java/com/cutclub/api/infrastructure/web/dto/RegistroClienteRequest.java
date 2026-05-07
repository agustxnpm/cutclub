package com.cutclub.api.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Petición de registro de cliente desde el portal de autoservicio.
 * El backend crea Usuario (rol CLIENTE) + Cliente con id compartido.
 */
public record RegistroClienteRequest(
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,
        @NotBlank(message = "El teléfono es obligatorio")
        String telefono,
        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        String contrasena,
        String codigoReferido
) {
}
