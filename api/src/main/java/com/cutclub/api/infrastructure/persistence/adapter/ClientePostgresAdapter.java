package com.cutclub.api.infrastructure.persistence.adapter;

import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.infrastructure.persistence.entity.ClienteJpaEntity;
import com.cutclub.api.infrastructure.persistence.mapper.ClienteMapper;
import com.cutclub.api.infrastructure.persistence.repository.ClienteJpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public class ClientePostgresAdapter implements ClienteRepository {

    private final ClienteJpaRepository clienteJpaRepository;
    private final ClienteMapper clienteMapper;

    public ClientePostgresAdapter(ClienteJpaRepository clienteJpaRepository,
                                  ClienteMapper clienteMapper) {
        this.clienteJpaRepository = clienteJpaRepository;
        this.clienteMapper = clienteMapper;
    }

    @Override
    public void save(Cliente cliente) {
        ClienteJpaEntity entity = clienteMapper.toEntity(cliente);
        clienteJpaRepository.save(entity);
    }
}
