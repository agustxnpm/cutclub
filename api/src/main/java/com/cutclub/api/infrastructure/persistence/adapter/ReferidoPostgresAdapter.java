package com.cutclub.api.infrastructure.persistence.adapter;

import com.cutclub.api.domain.model.Referido;
import com.cutclub.api.domain.port.ReferidoRepository;
import com.cutclub.api.infrastructure.persistence.mapper.ReferidoMapper;
import com.cutclub.api.infrastructure.persistence.repository.ReferidoJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class ReferidoPostgresAdapter implements ReferidoRepository {

    private final ReferidoJpaRepository referidoJpaRepository;
    private final ReferidoMapper referidoMapper;

    public ReferidoPostgresAdapter(ReferidoJpaRepository referidoJpaRepository,
                                   ReferidoMapper referidoMapper) {
        this.referidoJpaRepository = referidoJpaRepository;
        this.referidoMapper = referidoMapper;
    }

    @Override
    public void guardar(Referido referido) {
        referidoJpaRepository.save(referidoMapper.toEntity(referido));
    }

    @Override
    public Optional<Referido> buscarPorReferidoId(UUID referidoId) {
        return referidoJpaRepository.findByReferidoId(referidoId)
                .map(referidoMapper::toDomain);
    }
}
