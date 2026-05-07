package com.cutclub.api.infrastructure.security;

import com.cutclub.api.domain.port.ClienteRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Servicio de seguridad que permite validar la propiedad de un recurso de cliente
 * dentro de expresiones SpEL de {@code @PreAuthorize}.
 *
 * El principal del JWT es el número de teléfono del usuario autenticado.
 */
@Component("clienteSecurityService")
public class ClienteSecurityService {

    private final ClienteRepository clienteRepository;

    public ClienteSecurityService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * Verifica que el cliente autenticado (por teléfono en el JWT) sea el dueño
     * del recurso identificado por {@code clienteId}.
     *
     * @param authentication autenticación actual (principal = teléfono)
     * @param clienteId      UUID del cliente cuyo recurso se intenta acceder
     * @return {@code true} si el cliente autenticado es el mismo que el recurso
     */
    public boolean esPropio(Authentication authentication, String clienteId) {
        try {
            UUID id = UUID.fromString(clienteId);
            return clienteRepository.buscarPorId(id)
                    .map(c -> c.getTelefono().equals(authentication.getName()))
                    .orElse(false);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
