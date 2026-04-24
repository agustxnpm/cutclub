package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteYaExisteException;
import com.cutclub.api.domain.exception.CodigoReferidoInvalidoException;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.Referido;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.ReferidoRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;

public class RegistrarCuentaClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final ReferidoRepository referidoRepository;
    private final CodigoReferidoGenerator codigoReferidoGenerator;
    private final CodificadorContrasena codificadorContrasena;

    public RegistrarCuentaClienteUseCase(ClienteRepository clienteRepository,
                                         ReferidoRepository referidoRepository,
                                         CodigoReferidoGenerator codigoReferidoGenerator,
                                         CodificadorContrasena codificadorContrasena) {
        this.clienteRepository = clienteRepository;
        this.referidoRepository = referidoRepository;
        this.codigoReferidoGenerator = codigoReferidoGenerator;
        this.codificadorContrasena = codificadorContrasena;
    }

    public Cliente registrar(String nombre, String telefono, String contrasena, String codigoReferidoEntrada) {
        clienteRepository.buscarPorTelefono(telefono).ifPresent(existente -> {
            throw new ClienteYaExisteException(
                    "Ya existe un cliente registrado con el teléfono: " + telefono);
        });

        Cliente referente = resolverReferente(codigoReferidoEntrada);

        String contrasenaHash = codificadorContrasena.codificar(contrasena);
        String codigoReferidoPropio = codigoReferidoGenerator.generarCodigo();
        Cliente cliente = Cliente.crearNuevo(nombre, telefono, codigoReferidoPropio, contrasenaHash);
        clienteRepository.save(cliente);

        if (referente != null) {
            Referido referido = Referido.crearNuevo(referente.getId(), cliente.getId());
            referidoRepository.guardar(referido);
        }

        return cliente;
    }

    /**
     * Resuelve el referente a partir del código de entrada.
     * - Si el código está ausente o en blanco: retorna null (flujo normal).
     * - Si el código está presente pero no existe: lanza excepción (código inválido).
     */
    private Cliente resolverReferente(String codigoReferidoEntrada) {
        if (codigoReferidoEntrada == null || codigoReferidoEntrada.isBlank()) {
            return null;
        }
        return clienteRepository.buscarPorCodigoReferido(codigoReferidoEntrada)
                .orElseThrow(() -> new CodigoReferidoInvalidoException(codigoReferidoEntrada));
    }
}
