package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ClienteNoEncontradoException;
import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.domain.model.EstadoBeneficio;
import com.cutclub.api.domain.model.TipoBeneficio;
import com.cutclub.api.domain.port.BeneficioRepository;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.CorteRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Caso de uso: Registrar un nuevo corte para un cliente existente (HU 2.1).
 *
 * Persiste el corte e incrementa el contadorFidelidad del cliente.
 * Si al incrementar se alcanza el meta de fidelización, se genera un Beneficio
 * de tipo FIDELIZACION y el contador se reinicia a 0.
 */
public class RegistrarCorteUseCase {

    // Configurable: número de cortes pagados necesarios para obtener un corte gratis.
    private final int metaFidelidad;

    private final ClienteRepository clienteRepository;
    private final CorteRepository corteRepository;
    private final BeneficioRepository beneficioRepository;

    public RegistrarCorteUseCase(ClienteRepository clienteRepository,
                                 CorteRepository corteRepository,
                                 BeneficioRepository beneficioRepository,
                                 int metaFidelidad) {
        this.clienteRepository = clienteRepository;
        this.corteRepository = corteRepository;
        this.beneficioRepository = beneficioRepository;
        this.metaFidelidad = metaFidelidad;
    }

    public Corte ejecutar(UUID clienteId, String tipoCorte, BigDecimal precio) {
        Cliente cliente = clienteRepository.buscarPorId(clienteId)
                .orElseThrow(() -> new ClienteNoEncontradoException(
                        "No existe un cliente con id: " + clienteId));

        Corte corte = new Corte(null, clienteId, tipoCorte, precio, null, false);
        Corte cortePersistido = corteRepository.save(corte);

        // 1. Incrementar y verificar ciclo — el reinicio es la acción primaria en el dominio.
        cliente.incrementarFidelidad();
        boolean cicloCompleto = cliente.cicloFidelidadCompleto(metaFidelidad);

        // 2. Persistir el cliente (con el contador ya actualizado o reiniciado).
        clienteRepository.save(cliente);

        // 3. Si se completó el ciclo, generar el beneficio como consecuencia.
        if (cicloCompleto) {
            Beneficio beneficio = new Beneficio(
                    UUID.randomUUID(),
                    clienteId,
                    TipoBeneficio.FIDELIZACION,
                    EstadoBeneficio.AVAILABLE,
                    LocalDateTime.now(),
                    null
            );
            beneficioRepository.save(beneficio);
        }

        return cortePersistido;
    }
}
