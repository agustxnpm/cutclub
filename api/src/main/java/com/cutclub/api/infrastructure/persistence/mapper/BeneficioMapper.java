package com.cutclub.api.infrastructure.persistence.mapper;

import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.infrastructure.persistence.entity.BeneficioJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class BeneficioMapper {

    public Beneficio toDomain(BeneficioJpaEntity entity) {
        return new Beneficio(
                entity.getId(),
                entity.getClienteId(),
                entity.getTipo(),
                entity.getEstado(),
                entity.getFechaCreacion(),
                entity.getOrigenReferidoId()
        );
    }

    public BeneficioJpaEntity toEntity(Beneficio beneficio) {
        return new BeneficioJpaEntity(
                beneficio.getId(),
                beneficio.getClienteId(),
                beneficio.getTipo(),
                beneficio.getEstado(),
                beneficio.getFechaCreacion(),
                beneficio.getOrigenReferidoId()
        );
    }
}
