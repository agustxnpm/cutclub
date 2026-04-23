package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.PerfilCliente;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de salida (Outbound Port) para la persistencia de clientes.
 *
 * Define el contrato que debe cumplir cualquier adaptador de persistencia.
 * La implementación concreta (JPA, JDBC, etc.) se proveerá en la capa
 * de infraestructura.
 */
public interface ClienteRepository {

    void save(Cliente cliente);

    Optional<Cliente> buscarPorId(UUID id);

    List<Cliente> listarTodos();

    List<Cliente> buscarPorNombreOTelefono(String query);

    Optional<Cliente> buscarPorTelefono(String telefono);

    Optional<PerfilCliente> obtenerPerfil(String clienteId);
}
