package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteNoEncontradoException;
import com.cutclub.api.domain.model.PerfilCliente;
import com.cutclub.api.domain.port.ClienteRepository;

/**
 * Caso de uso: Obtener el perfil completo de un cliente.
 */
public class ObtenerPerfilClienteUseCase {

    private final ClienteRepository clienteRepository;

    public ObtenerPerfilClienteUseCase(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public PerfilCliente obtener(String clienteId) {
        return clienteRepository.obtenerPerfil(clienteId)
                .orElseThrow(() -> new ClienteNoEncontradoException(
                        "No se encontró el cliente con id: " + clienteId));
    }
}
