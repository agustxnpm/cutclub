package com.cutclub.api.domain.model;

import com.cutclub.api.domain.exception.ReferidoNoValidableException;

import java.util.UUID;

/**
 * Entidad de dominio que representa el vínculo entre un cliente referente
 * y un cliente nuevo (referido).
 *
 * El beneficio para el referente solo se materializa una vez que el barbero
 * valide presencialmente al referido (estado APPROVED).
 */
public class Referido {

    private final UUID id;
    private final UUID referenteId;
    private final UUID referidoId;
    private EstadoReferido estado;

    private Referido(UUID id, UUID referenteId, UUID referidoId, EstadoReferido estado) {
        this.id = id;
        this.referenteId = referenteId;
        this.referidoId = referidoId;
        this.estado = estado;
    }

    /**
     * Factory method para crear un nuevo vínculo de referido.
     * El estado inicial siempre es PENDING_VALIDATION.
     */
    public static Referido crearNuevo(UUID referenteId, UUID referidoId) {
        if (referenteId == null) {
            throw new IllegalArgumentException("El referenteId es obligatorio");
        }
        if (referidoId == null) {
            throw new IllegalArgumentException("El referidoId es obligatorio");
        }
        return new Referido(UUID.randomUUID(), referenteId, referidoId, EstadoReferido.PENDING_VALIDATION);
    }

    /**
     * Factory method para reconstruir un Referido existente desde persistencia.
     */
    public static Referido reconstruir(UUID id, UUID referenteId, UUID referidoId, EstadoReferido estado) {
        if (id == null) throw new IllegalArgumentException("El id no puede ser nulo al reconstruir un Referido");
        if (referenteId == null) throw new IllegalArgumentException("El referenteId es obligatorio");
        if (referidoId == null) throw new IllegalArgumentException("El referidoId es obligatorio");
        if (estado == null) throw new IllegalArgumentException("El estado es obligatorio");
        return new Referido(id, referenteId, referidoId, estado);
    }

    public UUID getId() {
        return id;
    }

    public UUID getReferenteId() {
        return referenteId;
    }

    public UUID getReferidoId() {
        return referidoId;
    }

    public EstadoReferido getEstado() {
        return estado;
    }

    /**
     * Aprueba el vínculo de referido. Solo es válido si el estado es PENDING_VALIDATION.
     * El barbero lo invoca cuando confirma presencialmente que el referido es un cliente nuevo.
     */
    public void aprobar() {
        if (this.estado != EstadoReferido.PENDING_VALIDATION) {
            throw new ReferidoNoValidableException(
                    "El referido no puede aprobarse porque su estado actual es: " + this.estado);
        }
        this.estado = EstadoReferido.APPROVED;
    }

    /**
     * Rechaza el vínculo de referido. Solo es válido si el estado es PENDING_VALIDATION.
     * El barbero lo invoca cuando el supuesto referido no es un cliente nuevo.
     */
    public void rechazar() {
        if (this.estado != EstadoReferido.PENDING_VALIDATION) {
            throw new ReferidoNoValidableException(
                    "El referido no puede rechazarse porque su estado actual es: " + this.estado);
        }
        this.estado = EstadoReferido.REJECTED;
    }
}
