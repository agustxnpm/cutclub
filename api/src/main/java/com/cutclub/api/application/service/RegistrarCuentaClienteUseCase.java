package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteYaExisteException;
import com.cutclub.api.domain.exception.CodigoReferidoInvalidoException;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.Referido;
import com.cutclub.api.domain.model.Rol;
import com.cutclub.api.domain.model.Usuario;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.ReferidoRepository;
import com.cutclub.api.domain.port.TokenProvider;
import com.cutclub.api.domain.port.UsuarioRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;

/**
 * Caso de uso: registro autónomo de un cliente (autoservicio desde el portal).
 *
 * Crea de forma sincronizada:
 *   1. La identidad autenticable {@link Usuario} (rol CLIENTE).
 *   2. El agregado de negocio {@link Cliente} con el MISMO id que el Usuario.
 *
 * Sincronización por id compartido (convención del sistema):
 *   un teléfono = una persona = un Usuario + un Cliente con id idéntico.
 * Permite resolver el agregado de negocio a partir del id autenticado en el JWT.
 *
 * Tras el registro emite directamente un token JWT (login automático).
 */
public class RegistrarCuentaClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final ReferidoRepository referidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CodigoReferidoGenerator codigoReferidoGenerator;
    private final CodificadorContrasena codificadorContrasena;
    private final TokenProvider tokenProvider;

    public RegistrarCuentaClienteUseCase(ClienteRepository clienteRepository,
                                         ReferidoRepository referidoRepository,
                                         UsuarioRepository usuarioRepository,
                                         CodigoReferidoGenerator codigoReferidoGenerator,
                                         CodificadorContrasena codificadorContrasena,
                                         TokenProvider tokenProvider) {
        this.clienteRepository = clienteRepository;
        this.referidoRepository = referidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.codigoReferidoGenerator = codigoReferidoGenerator;
        this.codificadorContrasena = codificadorContrasena;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public RegistroClienteResult registrar(String nombre, String telefono, String contrasena, String codigoReferidoEntrada) {
        clienteRepository.buscarPorTelefono(telefono).ifPresent(existente -> {
            throw new ClienteYaExisteException(
                    "Ya existe un cliente registrado con el teléfono: " + telefono);
        });
        usuarioRepository.buscarPorTelefono(telefono).ifPresent(existente -> {
            throw new ClienteYaExisteException(
                    "Ya existe un usuario registrado con el teléfono: " + telefono);
        });

        Cliente referente = resolverReferente(codigoReferidoEntrada);

        // 1) Crear la identidad autenticable.
        String contrasenaHash = codificadorContrasena.codificar(contrasena);
        Usuario usuario = Usuario.crearNuevo(telefono, contrasenaHash, EnumSet.of(Rol.CLIENTE));
        usuarioRepository.save(usuario);

        // 2) Crear el agregado de negocio con el MISMO id que la identidad.
        String codigoReferidoPropio = codigoReferidoGenerator.generarCodigo();
        Cliente cliente = Cliente.crearNuevoConId(usuario.getId(), nombre, telefono, codigoReferidoPropio);
        clienteRepository.save(cliente);

        if (referente != null) {
            Referido referido = Referido.crearNuevo(referente.getId(), cliente.getId());
            referidoRepository.guardar(referido);
        }

        String token = tokenProvider.generarToken(usuario);
        return new RegistroClienteResult(cliente, AutenticacionResult.of(usuario, token));
    }

    private Cliente resolverReferente(String codigoReferidoEntrada) {
        if (codigoReferidoEntrada == null || codigoReferidoEntrada.isBlank()) {
            return null;
        }
        return clienteRepository.buscarPorCodigoReferido(codigoReferidoEntrada)
                .orElseThrow(() -> new CodigoReferidoInvalidoException(codigoReferidoEntrada));
    }

    public record RegistroClienteResult(Cliente cliente, AutenticacionResult autenticacion) {
    }
}
