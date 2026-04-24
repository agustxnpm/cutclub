package com.cutclub.api.infrastructure.persistence.adapter;

import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.domain.model.EstadoBeneficio;
import com.cutclub.api.domain.model.PerfilCliente;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.infrastructure.persistence.entity.ClienteJpaEntity;
import com.cutclub.api.infrastructure.persistence.mapper.BeneficioMapper;
import com.cutclub.api.infrastructure.persistence.mapper.ClienteMapper;
import com.cutclub.api.infrastructure.persistence.mapper.CorteMapper;
import com.cutclub.api.infrastructure.persistence.repository.BeneficioJpaRepository;
import com.cutclub.api.infrastructure.persistence.repository.ClienteJpaRepository;
import com.cutclub.api.infrastructure.persistence.repository.CorteJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ClientePostgresAdapter implements ClienteRepository {

    private final ClienteJpaRepository clienteJpaRepository;
    private final CorteJpaRepository corteJpaRepository;
    private final BeneficioJpaRepository beneficioJpaRepository;
    private final ClienteMapper clienteMapper;
    private final CorteMapper corteMapper;
    private final BeneficioMapper beneficioMapper;

    public ClientePostgresAdapter(ClienteJpaRepository clienteJpaRepository,
                                  CorteJpaRepository corteJpaRepository,
                                  BeneficioJpaRepository beneficioJpaRepository,
                                  ClienteMapper clienteMapper,
                                  CorteMapper corteMapper,
                                  BeneficioMapper beneficioMapper) {
        this.clienteJpaRepository = clienteJpaRepository;
        this.corteJpaRepository = corteJpaRepository;
        this.beneficioJpaRepository = beneficioJpaRepository;
        this.clienteMapper = clienteMapper;
        this.corteMapper = corteMapper;
        this.beneficioMapper = beneficioMapper;
    }

    @Override
    public void save(Cliente cliente) {
        ClienteJpaEntity entity = clienteMapper.toEntity(cliente);
        clienteJpaRepository.save(entity);
    }

    @Override
    public Optional<Cliente> buscarPorId(UUID id) {
        return clienteJpaRepository.findById(id)
                .map(clienteMapper::toDomain);
    }

    @Override
    public List<Cliente> listarTodos() {
        return clienteJpaRepository.findAll().stream()
                .map(clienteMapper::toDomain)
                .toList();
    }

    @Override
    public List<Cliente> buscarPorNombreOTelefono(String query) {
        return clienteJpaRepository.searchByNombreOrTelefono(query).stream()
                .map(clienteMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Cliente> buscarPorTelefono(String telefono) {
        return clienteJpaRepository.findByTelefono(telefono)
                .or(() -> clienteJpaRepository.findByTelefonoEndingWith(telefono))
                .map(clienteMapper::toDomain);
    }

    @Override
    public Optional<Cliente> buscarPorCodigoReferido(String codigo) {
        return clienteJpaRepository.findByCodigoReferido(codigo)
                .map(clienteMapper::toDomain);
    }

    @Override
    public Optional<PerfilCliente> obtenerPerfil(String clienteId) {
        UUID id = UUID.fromString(clienteId);

        return clienteJpaRepository.findById(id).map(clienteEntity -> {
            Cliente cliente = clienteMapper.toDomain(clienteEntity);

            Corte ultimoCorte = corteJpaRepository.findFirstByClienteIdOrderByFechaDesc(id)
                    .map(corteMapper::toDomain)
                    .orElse(null);

            List<Beneficio> beneficiosDisponibles = beneficioJpaRepository.findByClienteIdAndEstado(id, EstadoBeneficio.AVAILABLE)
                    .stream()
                    .map(beneficioMapper::toDomain)
                    .toList();

            return new PerfilCliente(cliente, ultimoCorte, beneficiosDisponibles);
        });
    }
}
