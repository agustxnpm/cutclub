package com.cutclub.api.infrastructure.persistence.repository;

import com.cutclub.api.infrastructure.persistence.entity.CorteJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CorteJpaRepository extends JpaRepository<CorteJpaEntity, UUID> {

    Optional<CorteJpaEntity> findFirstByClienteIdOrderByFechaDesc(UUID clienteId);

    List<CorteJpaEntity> findByClienteIdOrderByFechaDesc(UUID clienteId);
}
