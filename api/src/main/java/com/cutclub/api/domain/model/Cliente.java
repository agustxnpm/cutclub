package com.cutclub.api.domain.model;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad de dominio que representa a un cliente de la barbería.
 *
 * Invariantes:
 * - El id se genera internamente y nunca puede ser nulo.
 * - nombre y telefono son obligatorios y no pueden estar vacíos.
 * - codigoReferido es obligatorio (proporcionado externamente).
 * - contadorFidelidad siempre inicia en 0 al crear un cliente nuevo.
 *
 * Nota arquitectónica:
 * - La autenticación NO es responsabilidad de este agregado.
 *   Las credenciales viven en {@link Usuario} (mismo id por convención cuando aplica).
 */
public class Cliente {

    private final UUID id;
    private final String nombre;
    private final String telefono;
    private final String codigoReferido;
    private int contadorFidelidad;
    private final LocalDate fechaRegistro;

    private Cliente(UUID id, String nombre, String telefono, String codigoReferido, int contadorFidelidad, LocalDate fechaRegistro) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.codigoReferido = codigoReferido;
        this.contadorFidelidad = contadorFidelidad;
        this.fechaRegistro = fechaRegistro;
    }

    /**
     * Factory method para crear un Cliente nuevo.
     * El id se genera automáticamente y el contadorFidelidad inicia en 0.
     */
    public static Cliente crearNuevo(String nombre, String telefono, String codigoReferido) {
        validarCamposObligatorios(nombre, telefono, codigoReferido);
        return new Cliente(UUID.randomUUID(), nombre, telefono, codigoReferido, 0, LocalDate.now());
    }

    /**
     * Crea un Cliente nuevo asignando explícitamente su id.
     * Se usa cuando el id debe coincidir con otra identidad (ej. el Usuario asociado).
     */
    public static Cliente crearNuevoConId(UUID id, String nombre, String telefono, String codigoReferido) {
        if (id == null) {
            throw new IllegalArgumentException("El id no puede ser nulo");
        }
        validarCamposObligatorios(nombre, telefono, codigoReferido);
        return new Cliente(id, nombre, telefono, codigoReferido, 0, LocalDate.now());
    }

    /**
     * Factory method para reconstruir un Cliente existente desde persistencia.
     */
    public static Cliente reconstruir(UUID id, String nombre, String telefono, String codigoReferido, int contadorFidelidad, LocalDate fechaRegistro) {
        if (id == null) {
            throw new IllegalArgumentException("El id no puede ser nulo al reconstruir un Cliente");
        }
        validarCamposObligatorios(nombre, telefono, codigoReferido);
        if (contadorFidelidad < 0) {
            throw new IllegalArgumentException("El contador de fidelidad no puede ser negativo");
        }
        return new Cliente(id, nombre, telefono, codigoReferido, contadorFidelidad, fechaRegistro);
    }

    private static void validarCamposObligatorios(String nombre, String telefono, String codigoReferido) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        if (telefono == null || telefono.isBlank()) {
            throw new IllegalArgumentException("El teléfono del cliente es obligatorio");
        }
        if (codigoReferido == null || codigoReferido.isBlank()) {
            throw new IllegalArgumentException("El código de referido es obligatorio");
        }
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public String getCodigoReferido() {
        return codigoReferido;
    }

    public int getContadorFidelidad() {
        return contadorFidelidad;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    /**
     * Incrementa el contador de fidelidad en 1.
     * Regla de negocio: se llama cada vez que se registra un corte pagado.
     */
    public void incrementarFidelidad() {
        this.contadorFidelidad++;
    }

    /**
     * Verifica si el contador alcanzó la meta de fidelización.
     * Si es así, lo reinicia a 0 y retorna true (indicando que corresponde generar un beneficio).
     *
     * @param meta número de cortes necesarios para completar un ciclo
     * @return true si se completó un ciclo y el contador fue reiniciado
     */
    public boolean cicloFidelidadCompleto(int meta) {
        if (this.contadorFidelidad >= meta) {
            this.contadorFidelidad = 0;
            return true;
        }
        return false;
    }
}
