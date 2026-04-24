package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteNoEncontradoException;
import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.EstadoReferido;
import com.cutclub.api.domain.model.PerfilCliente;
import com.cutclub.api.domain.model.TipoBeneficio;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.ReferidoRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Caso de uso: Obtener el perfil completo de un cliente, incluyendo si tiene
 * un referido pendiente de validación por parte del barbero.
 */
public class ObtenerPerfilClienteUseCase {

    private final ClienteRepository clienteRepository;
    private final ReferidoRepository referidoRepository;

    public ObtenerPerfilClienteUseCase(ClienteRepository clienteRepository,
                                       ReferidoRepository referidoRepository) {
        this.clienteRepository = clienteRepository;
        this.referidoRepository = referidoRepository;
    }

    public PerfilClienteResult obtener(String clienteId) {
        PerfilCliente perfil = clienteRepository.obtenerPerfil(clienteId)
                .orElseThrow(() -> new ClienteNoEncontradoException(
                        "No se encontró el cliente con id: " + clienteId));

        var referidoOpt = referidoRepository.buscarPorReferidoId(UUID.fromString(clienteId));

        boolean esReferidoPendiente = referidoOpt
                .map(r -> r.getEstado() == EstadoReferido.PENDING_VALIDATION)
                .orElse(false);

        String nombreReferente = null;
        if (esReferidoPendiente) {
            nombreReferente = referidoOpt
                    .flatMap(r -> clienteRepository.buscarPorId(r.getReferenteId()))
                    .map(Cliente::getNombre)
                    .orElse(null);
        }

        Map<UUID, String> descripcionesBeneficios = new HashMap<>();
        for (Beneficio b : perfil.beneficiosDisponibles()) {
            if (b.getTipo() == TipoBeneficio.FIDELIZACION) {
                descripcionesBeneficios.put(b.getId(), "Ganado por fidelidad");
            } else if (b.getTipo() == TipoBeneficio.REFERIDO && b.getOrigenReferidoId() != null) {
                String nombreReferido = clienteRepository.buscarPorId(b.getOrigenReferidoId())
                        .map(Cliente::getNombre)
                        .orElse("un cliente");
                descripcionesBeneficios.put(b.getId(), "Ganado por referir a " + nombreReferido);
            } else {
                descripcionesBeneficios.put(b.getId(), "Beneficio activo");
            }
        }

        return new PerfilClienteResult(perfil, esReferidoPendiente, nombreReferente, descripcionesBeneficios);
    }
}
