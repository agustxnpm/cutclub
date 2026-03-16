package com.cutclub.api.domain.port;

import com.cutclub.api.domain.model.Cliente;

/**
 * Puerto de salida (Outbound Port) para la persistencia de clientes.
 *
 * Define el contrato que debe cumplir cualquier adaptador de persistencia.
 * La implementación concreta (JPA, JDBC, etc.) se proveerá en la capa
 * de infraestructura.
 */
public interface ClienteRepository {

    /**
     * Persiste un cliente en el almacenamiento.
     *
     * @param cliente el cliente a guardar
     */
    void save(Cliente cliente);
}
