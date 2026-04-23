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
                entity.getTipoCorte(),
                entity.getPrecio(),
                entity.getFecha(),
                entity.isEsGratis()
        );
    }

    public CorteJpaEntity toEntity(Corte corte) {
        return new CorteJpaEntity(
                corte.id(),
                corte.clienteId(),
                corte.tipoCorte(),
                corte.precio(),
                corte.fecha(),
                corte.esGratis()
        );
    }
}
