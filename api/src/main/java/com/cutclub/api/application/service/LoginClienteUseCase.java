package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteNoEncontradoException;
import com.cutclub.api.domain.exception.CredencialesInvalidasException;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;

public class LoginClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final CodificadorContrasena codificadorContrasena;

    public LoginClienteUseCase(ClienteRepository clienteRepository,
                               CodificadorContrasena codificadorContrasena) {
        this.clienteRepository = clienteRepository;
        this.codificadorContrasena = codificadorContrasena;
    }

    public Cliente login(String telefono, String contrasena) {
        Cliente cliente = clienteRepository.buscarPorTelefono(telefono)
                .orElseThrow(() -> new ClienteNoEncontradoException(
                        "No se encontró un cliente con el teléfono: " + telefono));

        if (cliente.getContrasenaHash() == null
                || !codificadorContrasena.verificar(contrasena, cliente.getContrasenaHash())) {
            throw new CredencialesInvalidasException("Contraseña incorrecta");
        }

        return cliente;
    }
}
