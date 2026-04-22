package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteYaExisteException;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;

public class RegistrarCuentaClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final CodigoReferidoGenerator codigoReferidoGenerator;
    private final CodificadorContrasena codificadorContrasena;

    public RegistrarCuentaClienteUseCase(ClienteRepository clienteRepository,
                                         CodigoReferidoGenerator codigoReferidoGenerator,
                                         CodificadorContrasena codificadorContrasena) {
        this.clienteRepository = clienteRepository;
        this.codigoReferidoGenerator = codigoReferidoGenerator;
        this.codificadorContrasena = codificadorContrasena;
    }

    public Cliente registrar(String nombre, String telefono, String contrasena) {
        clienteRepository.buscarPorTelefono(telefono).ifPresent(existente -> {
            throw new ClienteYaExisteException(
                    "Ya existe un cliente registrado con el teléfono: " + telefono);
        });

        String contrasenaHash = codificadorContrasena.codificar(contrasena);
        String codigoReferido = codigoReferidoGenerator.generarCodigo();
        Cliente cliente = Cliente.crearNuevo(nombre, telefono, codigoReferido, contrasenaHash);
        clienteRepository.save(cliente);

        return cliente;
    }
}
