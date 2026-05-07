package com.cutclub.api.infrastructure.web.dto;

import java.util.Set;
import java.util.UUID;

/**
 * Respuesta única para login y registro: incluye token JWT, datos identificatorios
 * y roles. {@code id} es compartido entre Usuario y Cliente (convención del dominio),
 * por eso el cliente web/mobile lo usa como {@code clienteId} para navegar al perfil.
 */
public record LoginResponse(
        UUID id,
        String token,
        String telefono,
        String nombre,
        Set<String> roles
) {
}
