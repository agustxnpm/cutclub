package com.cutclub.api.infrastructure.persistence.mapper;

import com.cutclub.api.domain.model.EstadoReferido;
import com.cutclub.api.domain.model.Referido;
import com.cutclub.api.infrastructure.persistence.entity.ReferidoJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class ReferidoMapper {

    public ReferidoJpaEntity toEntity(Referido domain) {
        return new ReferidoJpaEntity(
                domain.getId(),
                domain.getReferenteId(),
                domain.getReferidoId(),
                domain.getEstado().name()
        );
    }

    public Referido toDomain(ReferidoJpaEntity entity) {
        return Referido.reconstruir(
                entity.getId(),
                entity.getReferenteId(),
                entity.getReferidoId(),
                EstadoReferido.valueOf(entity.getEstado())
        );
    }
}
