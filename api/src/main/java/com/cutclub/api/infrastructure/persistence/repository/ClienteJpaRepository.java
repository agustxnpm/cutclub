package com.cutclub.api.infrastructure.persistence.repository;

import com.cutclub.api.infrastructure.persistence.entity.ClienteJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClienteJpaRepository extends JpaRepository<ClienteJpaEntity, UUID> {

    Optional<ClienteJpaEntity> findByTelefono(String telefono);

    Optional<ClienteJpaEntity> findByCodigoReferido(String codigoReferido);

    @Query(value = "SELECT * FROM clientes WHERE telefono LIKE CONCAT('%', :suffix) LIMIT 1",
            nativeQuery = true)
    Optional<ClienteJpaEntity> findByTelefonoEndingWith(@Param("suffix") String suffix);

    boolean existsByCodigoReferido(String codigoReferido);

    @Query(value = "SELECT * FROM clientes WHERE nombre ILIKE CONCAT('%', :query, '%') " +
            "OR telefono ILIKE CONCAT('%', :query, '%')",
            nativeQuery = true)
    List<ClienteJpaEntity> searchByNombreOrTelefono(@Param("query") String query);
}
