package com.cutclub.api.infrastructure.persistence.mapper;

import com.cutclub.api.domain.model.Rol;
import com.cutclub.api.domain.model.Usuario;
import com.cutclub.api.infrastructure.persistence.entity.UsuarioJpaEntity;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Set;

@Component
public class UsuarioMapper {

    public Usuario toDomain(UsuarioJpaEntity entity) {
        Set<Rol> roles = entity.getRoles() == null || entity.getRoles().isEmpty()
                ? EnumSet.noneOf(Rol.class)
                : EnumSet.copyOf(entity.getRoles());
        return Usuario.reconstruir(
                entity.getId(),
                entity.getTelefono(),
                entity.getPasswordHash(),
                roles,
                Boolean.TRUE.equals(entity.getActivo())
        );
    }

    public UsuarioJpaEntity toEntity(Usuario usuario) {
        return new UsuarioJpaEntity(
                usuario.getId(),
                usuario.getTelefono(),
                usuario.getPasswordHash(),
                usuario.isActivo(),
                EnumSet.copyOf(usuario.getRoles())
        );
    }
}
