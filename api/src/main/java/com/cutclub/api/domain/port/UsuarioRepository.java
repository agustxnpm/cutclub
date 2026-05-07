package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Usuario;

import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de salida para la persistencia de usuarios autenticables.
 */
public interface UsuarioRepository {

    void save(Usuario usuario);

    Optional<Usuario> buscarPorTelefono(String telefono);

    Optional<Usuario> buscarPorId(UUID id);
}
