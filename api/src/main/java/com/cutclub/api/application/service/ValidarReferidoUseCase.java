package com.cutclub.api.application.service;

import com.cutclub.api.domain.exception.ReferidoNoEncontradoException;
import com.cutclub.api.domain.model.Beneficio;
import com.cutclub.api.domain.model.EstadoBeneficio;
import com.cutclub.api.domain.model.Referido;
import com.cutclub.api.domain.model.TipoBeneficio;
import com.cutclub.api.domain.port.BeneficioRepository;
import com.cutclub.api.domain.port.ReferidoRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Caso de uso: Validación presencial del referido (HU 3.3).
 *
 * El barbero confirma o rechaza si el cliente recién atendido es,
 * de hecho, un cliente nuevo que llegó referido. Solo ante confirmación
 * se genera el beneficio REFERIDO para el referente.
 *
 * [Application Layer]
 */
public class ValidarReferidoUseCase {

    private final ReferidoRepository referidoRepository;
    private final BeneficioRepository beneficioRepository;

    public ValidarReferidoUseCase(ReferidoRepository referidoRepository,
                                   BeneficioRepository beneficioRepository) {
        this.referidoRepository = referidoRepository;
        this.beneficioRepository = beneficioRepository;
    }

    @Transactional
    public void validar(UUID referidoId, boolean esNuevoReal) {
        Referido referido = referidoRepository.buscarPorReferidoId(referidoId)
                .orElseThrow(() -> new ReferidoNoEncontradoException(
                        "No existe un referido pendiente para el cliente: " + referidoId));

        if (esNuevoReal) {
            referido.aprobar();
            Beneficio premio = new Beneficio(
                    UUID.randomUUID(),
                    referido.getReferenteId(),
                    TipoBeneficio.REFERIDO,
                    EstadoBeneficio.AVAILABLE,
                    LocalDateTime.now(),
                    referido.getReferidoId()
            );
            beneficioRepository.save(premio);
        } else {
            referido.rechazar();
        }

        referidoRepository.guardar(referido);
    }
}
