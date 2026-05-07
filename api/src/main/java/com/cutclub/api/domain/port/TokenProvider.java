package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Rol;
import com.cutclub.api.domain.model.Usuario;

import java.util.Optional;
import java.util.Set;

/**
 * Puerto de salida para generar y validar tokens de autenticación.
 *
 * Permite que el dominio razone sobre tokens sin acoplarse a JWT
 * (la implementación concreta vive en infraestructura).
 */
public interface TokenProvider {

    /**
     * Genera un token firmado para el usuario indicado.
     */
    String generarToken(Usuario usuario);

    /**
     * Valida la firma y vigencia del token.
     * Retorna los datos extraídos si es válido, vacío en caso contrario.
     */
    Optional<DatosToken> validar(String token);

    /**
     * Datos mínimos extraídos de un token válido para autenticar peticiones entrantes.
     */
    record DatosToken(String telefono, Set<Rol> roles) {
    }
}
