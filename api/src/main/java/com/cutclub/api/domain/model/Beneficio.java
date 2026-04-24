package com.cutclub.api.domain.model;

import com.cutclub.api.domain.exception.BeneficioNoDisponibleException;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidad de dominio que representa un beneficio otorgado a un cliente
 * (por fidelización o referido). Un beneficio AVAILABLE puede ser canjeado una sola vez.
 */
public class Beneficio {

    private final UUID id;
    private final UUID clienteId;
    private final TipoBeneficio tipo;
    private EstadoBeneficio estado;
    private final LocalDateTime fechaCreacion;
    /** UUID del cliente referido que originó este beneficio. Solo aplica para tipo REFERIDO. */
    private final UUID origenReferidoId;

    public Beneficio(UUID id, UUID clienteId, TipoBeneficio tipo, EstadoBeneficio estado, LocalDateTime fechaCreacion, UUID origenReferidoId) {
        if (id == null) throw new IllegalArgumentException("El id del beneficio no puede ser nulo");
        if (clienteId == null) throw new IllegalArgumentException("El clienteId no puede ser nulo");
        if (tipo == null) throw new IllegalArgumentException("El tipo de beneficio es obligatorio");
        if (estado == null) throw new IllegalArgumentException("El estado del beneficio es obligatorio");
        if (fechaCreacion == null) throw new IllegalArgumentException("La fecha de creación es obligatoria");
        this.id = id;
        this.clienteId = clienteId;
        this.tipo = tipo;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.origenReferidoId = origenReferidoId;
    }

    public void canjear() {
        if (this.estado != EstadoBeneficio.AVAILABLE) {
            throw new BeneficioNoDisponibleException(
                    "El beneficio no está disponible para canje. Estado actual: " + this.estado);
        }
        this.estado = EstadoBeneficio.USED;
    }

    public UUID getId() { return id; }
    public UUID getClienteId() { return clienteId; }
    public TipoBeneficio getTipo() { return tipo; }
    public EstadoBeneficio getEstado() { return estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public UUID getOrigenReferidoId() { return origenReferidoId; }
}
