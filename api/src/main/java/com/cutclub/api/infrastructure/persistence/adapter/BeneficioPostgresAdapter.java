package com.cutclub.api.infrastructure.persistence.adapter;

import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.port.BeneficioRepository;
import com.cutclub.api.infrastructure.persistence.mapper.BeneficioMapper;
import com.cutclub.api.infrastructure.persistence.repository.BeneficioJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class BeneficioPostgresAdapter implements BeneficioRepository {

    private final BeneficioJpaRepository beneficioJpaRepository;
    private final BeneficioMapper beneficioMapper;

    public BeneficioPostgresAdapter(BeneficioJpaRepository beneficioJpaRepository,
                                    BeneficioMapper beneficioMapper) {
        this.beneficioJpaRepository = beneficioJpaRepository;
        this.beneficioMapper = beneficioMapper;
    }

    @Override
    public Optional<Beneficio> findById(UUID id) {
        return beneficioJpaRepository.findById(id)
                .map(beneficioMapper::toDomain);
    }

    @Override
    public void save(Beneficio beneficio) {
        beneficioJpaRepository.save(beneficioMapper.toEntity(beneficio));
    }
}
