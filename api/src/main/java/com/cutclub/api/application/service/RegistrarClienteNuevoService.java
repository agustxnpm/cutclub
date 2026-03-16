package com.cutclub.api.application.service;

import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;

/**
 * Caso de uso para registrar un cliente nuevo.
 * Orquesta los componentes del dominio sin contener lógica de negocio propia.
 */
public class RegistrarClienteNuevoService {

    private final ClienteRepository clienteRepository;
    private final CodigoReferidoGenerator codigoReferidoGenerator;

    public RegistrarClienteNuevoService(ClienteRepository clienteRepository,
                                        CodigoReferidoGenerator codigoReferidoGenerator) {
        this.clienteRepository = clienteRepository;
        this.codigoReferidoGenerator = codigoReferidoGenerator;
    }

    public Cliente registrarCliente(String nombre, String telefono) {
        String codigoReferido = codigoReferidoGenerator.generarCodigo();

        Cliente cliente = Cliente.crearNuevo(nombre, telefono, codigoReferido);

        clienteRepository.save(cliente);

        return cliente;
    }
}
