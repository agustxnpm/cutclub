package com.cutclub.api.application.service;

import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.port.ClienteRepository;

import java.util.List;

/**
 * Caso de uso: Buscar clientes por nombre o teléfono.
 */
public class BuscarClientesUseCase {

    private final ClienteRepository clienteRepository;

    public BuscarClientesUseCase(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> listar() {
        return clienteRepository.listarTodos();
    }

    public List<Cliente> buscar(String query) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        return clienteRepository.buscarPorNombreOTelefono(query.trim());
    }
}
