package com.cutclub.api.application.service;

import com.cutclub.api.domain.model.Rol;
import com.cutclub.api.domain.model.Usuario;

import java.util.Set;
import java.util.UUID;

/**
 * Resultado de una autenticación exitosa: datos básicos del usuario y token JWT.
 */
public record AutenticacionResult(UUID id, String token, String telefono, Set<Rol> roles) {

    public static AutenticacionResult of(Usuario usuario, String token) {
        return new AutenticacionResult(usuario.getId(), token, usuario.getTelefono(), usuario.getRoles());
    }
}
