package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.CredencialesInvalidasException;
import com.cutclub.api.domain.exception.LicenciaExpiradaException;
import com.cutclub.api.domain.model.Rol;
import com.cutclub.api.domain.model.Usuario;
import com.cutclub.api.domain.port.TokenProvider;
import com.cutclub.api.domain.port.UsuarioRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;

/**
 * Caso de uso: autenticar un usuario por teléfono y contraseña.
 *
 * Reglas:
 * - Si el usuario no existe o la contraseña no coincide → CredencialesInvalidasException.
 * - Si el usuario tiene rol BARBERO y su licencia está inactiva → LicenciaExpiradaException.
 * - Si todo es válido, retorna un token JWT junto con los datos básicos del usuario.
 *
 * Mensaje genérico para credenciales inválidas: evita filtrar si el teléfono existe o no.
 */
public class AutenticarUsuarioUseCase {

    private final UsuarioRepository usuarioRepository;
    private final CodificadorContrasena codificadorContrasena;
    private final TokenProvider tokenProvider;

    public AutenticarUsuarioUseCase(UsuarioRepository usuarioRepository,
                                    CodificadorContrasena codificadorContrasena,
                                    TokenProvider tokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.codificadorContrasena = codificadorContrasena;
        this.tokenProvider = tokenProvider;
    }

    public AutenticacionResult autenticar(String telefono, String contrasena) {
        Usuario usuario = usuarioRepository.buscarPorTelefono(telefono)
                .orElseThrow(() -> new CredencialesInvalidasException("Credenciales inválidas"));

        if (!codificadorContrasena.verificar(contrasena, usuario.getPasswordHash())) {
            throw new CredencialesInvalidasException("Credenciales inválidas");
        }

        if (usuario.tieneRol(Rol.BARBERO) && !usuario.isActivo()) {
            throw new LicenciaExpiradaException(
                    "La licencia de la barbería se encuentra inactiva. Regularice el pago para continuar.");
        }

        String token = tokenProvider.generarToken(usuario);
        return AutenticacionResult.of(usuario, token);
    }
}
