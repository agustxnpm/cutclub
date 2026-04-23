package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.BeneficioNoEncontradoException;
import com.cutclub.api.domain.exception.ClienteNoEncontradoException;
import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.domain.port.BeneficioRepository;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.CorteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Caso de uso: Canjear un beneficio de Corte Gratis al cobrar (HU 2.2).
 *
 * El precio del corte queda en 0 y el beneficio pasa a estado USED.
 * La operación es transaccional: si falla la persistencia del corte,
 * el beneficio no queda marcado como usado.
 */
@Service
@Transactional
public class CanjearCorteGratisUseCase {

    private final ClienteRepository clienteRepository;
    private final BeneficioRepository beneficioRepository;
    private final CorteRepository corteRepository;

    public CanjearCorteGratisUseCase(ClienteRepository clienteRepository,
                                     BeneficioRepository beneficioRepository,
                                     CorteRepository corteRepository) {
        this.clienteRepository = clienteRepository;
        this.beneficioRepository = beneficioRepository;
        this.corteRepository = corteRepository;
    }

    public Corte ejecutar(UUID clienteId, UUID beneficioId, String tipoCorte) {
        // 1. Validar existencia del cliente
        clienteRepository.buscarPorId(clienteId)
                .orElseThrow(() -> new ClienteNoEncontradoException(
                        "No existe un cliente con id: " + clienteId));

        // 2. Recuperar el beneficio y validar que pertenezca al cliente
        Beneficio beneficio = beneficioRepository.findById(beneficioId)
                .orElseThrow(() -> new BeneficioNoEncontradoException(
                        "No existe un beneficio con id: " + beneficioId));

        if (!beneficio.getClienteId().equals(clienteId)) {
            throw new BeneficioNoEncontradoException(
                    "El beneficio no pertenece al cliente indicado");
        }

        // 3. Ejecutar canjear() — lanza BeneficioNoDisponibleException si no está AVAILABLE
        beneficio.canjear();

        // 4. Crear el corte con precio = 0 y esGratis = true
        Corte corte = new Corte(null, clienteId, tipoCorte, BigDecimal.ZERO, null, true);

        // 5. Persistir ambos cambios dentro de la misma transacción
        beneficioRepository.save(beneficio);
        return corteRepository.save(corte);
    }
}
