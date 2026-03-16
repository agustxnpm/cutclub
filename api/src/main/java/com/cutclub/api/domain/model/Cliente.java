package com.cutclub.api.domain.model;

import java.util.UUID;

/**
 * Entidad de dominio que representa a un cliente de la barbería.
 *
 * Invariantes:
 * - El id se genera internamente y nunca puede ser nulo.
 * - nombre y telefono son obligatorios y no pueden estar vacíos.
 * - codigoReferido es obligatorio (proporcionado externamente).
 * - contadorFidelidad siempre inicia en 0 al crear un cliente nuevo.
 */
public class Cliente {

    private final UUID id;
    private final String nombre;
    private final String telefono;
    private final String codigoReferido;
    private int contadorFidelidad;

    // Constructor privado — la creación se controla mediante factory methods
    private Cliente(UUID id, String nombre, String telefono, String codigoReferido, int contadorFidelidad) {
        this.id = id;
        this.nombre = nombre;
        this.telefono = telefono;
        this.codigoReferido = codigoReferido;
        this.contadorFidelidad = contadorFidelidad;
    }

    /**
     * Factory method para crear un Cliente nuevo.
     * El id se genera automáticamente y el contadorFidelidad inicia en 0.
     */
    public static Cliente crearNuevo(String nombre, String telefono, String codigoReferido) {
        validarCamposObligatorios(nombre, telefono, codigoReferido);
        return new Cliente(UUID.randomUUID(), nombre, telefono, codigoReferido, 0);
    }

    /**
     * Factory method para reconstruir un Cliente existente desde persistencia.
     * Permite restaurar el estado completo sin violar las reglas de creación.
     */
    public static Cliente reconstruir(UUID id, String nombre, String telefono, String codigoReferido, int contadorFidelidad) {
        if (id == null) {
            throw new IllegalArgumentException("El id no puede ser nulo al reconstruir un Cliente");
        }
        validarCamposObligatorios(nombre, telefono, codigoReferido);
        if (contadorFidelidad < 0) {
            throw new IllegalArgumentException("El contador de fidelidad no puede ser negativo");
        }
        return new Cliente(id, nombre, telefono, codigoReferido, contadorFidelidad);
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
}
