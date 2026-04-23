package com.cutclub.api.infrastructure.persistence.adapter;

import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.domain.port.CorteRepository;
import com.cutclub.api.infrastructure.persistence.entity.CorteJpaEntity;
import com.cutclub.api.infrastructure.persistence.mapper.CorteMapper;
import com.cutclub.api.infrastructure.persistence.repository.CorteJpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public class CortePostgresAdapter implements CorteRepository {

    private final CorteJpaRepository corteJpaRepository;
    private final CorteMapper corteMapper;

    public CortePostgresAdapter(CorteJpaRepository corteJpaRepository, CorteMapper corteMapper) {
        this.corteJpaRepository = corteJpaRepository;
        this.corteMapper = corteMapper;
    }

    @Override
    public Corte save(Corte corte) {
        CorteJpaEntity entity = corteMapper.toEntity(corte);
        CorteJpaEntity saved = corteJpaRepository.save(entity);
        return corteMapper.toDomain(saved);
    }
}
