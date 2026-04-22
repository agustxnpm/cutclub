package com.cutclub.api.infrastructure.persistence.mapper;

import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.infrastructure.persistence.entity.ClienteJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public Cliente toDomain(ClienteJpaEntity entity) {
        return Cliente.reconstruir(
                entity.getId(),
                entity.getNombre(),
                entity.getTelefono(),
                entity.getCodigoReferido(),
                entity.getContadorFidelidad(),
                entity.getContrasenaHash()
        );
    }

    public ClienteJpaEntity toEntity(Cliente domain) {
        return new ClienteJpaEntity(
                domain.getId(),
                domain.getNombre(),
                domain.getTelefono(),
                domain.getCodigoReferido(),
                domain.getContadorFidelidad(),
                domain.getContrasenaHash()
        );
    }
}
