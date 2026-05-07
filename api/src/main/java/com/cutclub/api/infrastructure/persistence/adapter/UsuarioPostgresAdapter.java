package com.cutclub.api.infrastructure.persistence.adapter;

import com.cutclub.api.domain.model.Usuario;
import com.cutclub.api.domain.port.UsuarioRepository;
import com.cutclub.api.infrastructure.persistence.mapper.UsuarioMapper;
import com.cutclub.api.infrastructure.persistence.repository.UsuarioJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class UsuarioPostgresAdapter implements UsuarioRepository {

    private final UsuarioJpaRepository usuarioJpaRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioPostgresAdapter(UsuarioJpaRepository usuarioJpaRepository,
                                  UsuarioMapper usuarioMapper) {
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.usuarioMapper = usuarioMapper;
    }

    @Override
    public void save(Usuario usuario) {
        usuarioJpaRepository.save(usuarioMapper.toEntity(usuario));
    }

    @Override
    public Optional<Usuario> buscarPorTelefono(String telefono) {
        return usuarioJpaRepository.findByTelefono(telefono)
                .map(usuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) {
        return usuarioJpaRepository.findById(id)
                .map(usuarioMapper::toDomain);
    }
}
