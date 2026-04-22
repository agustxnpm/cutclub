package com.cutclub.api.infrastructure.persistence.repository;

import com.cutclub.api.infrastructure.persistence.entity.BeneficioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BeneficioJpaRepository extends JpaRepository<BeneficioJpaEntity, UUID> {

    List<BeneficioJpaEntity> findByClienteIdAndActivoTrue(UUID clienteId);
}
