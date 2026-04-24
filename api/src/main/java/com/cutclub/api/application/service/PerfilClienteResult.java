package com.cutclub.api.application.service;

import com.cutclub.api.domain.model.PerfilCliente;

import java.util.Map;
import java.util.UUID;

/**
 * Resultado compuesto del caso de uso ObtenerPerfilClienteUseCase.
 * Incluye el perfil del cliente, si tiene un referido pendiente de validación presencial,
 * el nombre del cliente que lo refirio (si aplica) y las descripciones de origen por beneficio.
 *
 * [Application Layer]
 */
public record PerfilClienteResult(
        PerfilCliente perfil,
        boolean esReferidoPendiente,
        String nombreReferente,
        Map<UUID, String> descripcionesBeneficios
) {
}
