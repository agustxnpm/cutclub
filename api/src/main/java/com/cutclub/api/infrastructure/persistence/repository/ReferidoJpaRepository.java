package com.cutclub.api.infrastructure.persistence.repository;

import com.cutclub.api.infrastructure.persistence.entity.ReferidoJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReferidoJpaRepository extends JpaRepository<ReferidoJpaEntity, UUID> {
}
