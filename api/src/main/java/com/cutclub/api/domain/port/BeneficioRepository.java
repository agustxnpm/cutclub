package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Beneficio;

import java.util.Optional;
import java.util.UUID;

public interface BeneficioRepository {

    Optional<Beneficio> findById(UUID id);

    void save(Beneficio beneficio);
}
