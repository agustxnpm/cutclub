package com.cutclub.api.infrastructure.persistence.mapper;

import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.infrastructure.persistence.entity.CorteJpaEntity;
import org.springframework.stereotype.Component;

@Component
public class CorteMapper {

    public Corte toDomain(CorteJpaEntity entity) {
        return new Corte(
                entity.getId(),
                entity.getClienteId(),
                entity.getFecha(),
                entity.getTipo(),
                entity.getNotas()
        );
    }
}
